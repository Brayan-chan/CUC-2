"use client"

import { useState, useEffect } from "react"
import {
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { createOrUpdateUser, getUserData, type UserData } from "@/lib/firestore"

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        try {
          const userData = await getUserData(user.uid)
          setUserData(userData)
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      } else {
        setUserData(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setError(null)
      setLoading(true)
      const result = await signInWithEmailAndPassword(auth, email, password)

      // Update user data in Firestore
      await createOrUpdateUser({
        id: result.user.uid,
        email: result.user.email || "",
        displayName: result.user.displayName || "",
        role: "contributor", // Default role
      })

      return result
    } catch (error: any) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (
    email: string,
    password: string,
    displayName: string,
    role: UserData["role"] = "contributor",
    institution?: string,
    matricula?: string,
  ) => {
    try {
      setError(null)
      setLoading(true)
      const result = await createUserWithEmailAndPassword(auth, email, password)

      // Update profile
      await updateProfile(result.user, { displayName })

      // Create user data in Firestore
      await createOrUpdateUser({
        id: result.user.uid,
        email,
        displayName,
        role,
        institution,
        matricula,
      })

      return result
    } catch (error: any) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
    } catch (error: any) {
      setError(error.message)
      throw error
    }
  }

  return {
    user,
    userData,
    loading,
    error,
    login,
    register,
    logout,
  }
}
