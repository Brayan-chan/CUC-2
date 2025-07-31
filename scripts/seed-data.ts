import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD8vVBs4jPVJ3CPJhWjxpUpgnPwTUfUBcY",
  authDomain: "cultura-c3564.firebaseapp.com",
  projectId: "cultura-c3564",
  storageBucket: "cultura-c3564.firebasestorage.app",
  messagingSenderId: "498924077689",
  appId: "1:498924077689:web:b65a6b7b2c9e5e6f6a6b7b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample data
const sampleEvents = [
  {
    title: "Festival Cultural Maya 2024",
    description: "Celebración anual de la cultura maya con danzas tradicionales, música y gastronomía ancestral",
    category: "Festival",
    type: "Cultural",
    location: "Plaza Central UACAM",
    date: new Date('2024-12-15'),
    participants: "200+ asistentes",
    images: [
      "https://via.placeholder.com/800x600/FF6B6B/FFFFFF?text=Festival+Maya",
      "https://via.placeholder.com/800x600/4ECDC4/FFFFFF?text=Danzas+Tradicionales"
    ],
    tags: ["maya", "cultura", "festival", "tradición"],
    isFeatured: true,
    createdBy: "admin",
    gradient: "from-red-500 to-pink-500"
  },
  {
    title: "Exposición Patrimonio Histórico",
    description: "Muestra de documentos y fotografías históricas de la Universidad y la región",
    category: "Exposición", 
    type: "Histórico",
    location: "Biblioteca UACAM",
    date: new Date('2024-11-20'),
    participants: "150+ visitantes",
    images: [
      "https://via.placeholder.com/800x600/45B7D1/FFFFFF?text=Exposición+Histórica",
      "https://via.placeholder.com/800x600/96CEB4/FFFFFF?text=Documentos+Antiguos"
    ],
    tags: ["historia", "patrimonio", "documentos", "fotografía"],
    isFeatured: true,
    createdBy: "admin",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "Conferencia Lenguas Originarias",
    description: "Simposio sobre la preservación y revitalización de las lenguas indígenas de Campeche",
    category: "Conferencia",
    type: "Académico", 
    location: "Auditorio Principal",
    date: new Date('2024-10-30'),
    participants: "80+ académicos",
    images: [
      "https://via.placeholder.com/800x600/F7DC6F/FFFFFF?text=Lenguas+Originarias",
      "https://via.placeholder.com/800x600/BB8FCE/FFFFFF?text=Simposio+Académico"
    ],
    tags: ["lenguas", "indígenas", "preservación", "académico"],
    isFeatured: true,
    createdBy: "admin",
    gradient: "from-yellow-500 to-orange-500"
  }
];

const sampleGalleryItems = [
  {
    title: "Códice Maya Restaurado",
    description: "Documento prehispánico restaurado digitalmente",
    type: "Documento",
    imageUrl: "https://via.placeholder.com/600x800/8E44AD/FFFFFF?text=Códice+Maya",
    eventId: "",
    isHighlighted: true,
    tags: ["códice", "maya", "prehispánico", "restauración"]
  },
  {
    title: "Fotografía Histórica UACAM 1960",
    description: "Vista aérea de la universidad en sus primeros años",
    type: "Fotografía",
    imageUrl: "https://via.placeholder.com/800x600/2ECC71/FFFFFF?text=UACAM+1960",
    eventId: "",
    isHighlighted: true,
    tags: ["fotografía", "histórica", "universidad", "1960"]
  },
  {
    title: "Manuscrito Colonial",
    description: "Documento de la época colonial sobre la fundación de Campeche",
    type: "Manuscrito",
    imageUrl: "https://via.placeholder.com/600x800/E67E22/FFFFFF?text=Manuscrito+Colonial",
    eventId: "",
    isHighlighted: true,
    tags: ["manuscrito", "colonial", "campeche", "fundación"]
  }
];

async function seedData() {
  try {
    console.log('Seeding events...');
    
    // Add events
    for (let i = 0; i < sampleEvents.length; i++) {
      const event = sampleEvents[i];
      const docRef = doc(db, 'events', `event-${i + 1}`);
      await setDoc(docRef, {
        ...event,
        date: Timestamp.fromDate(event.date),
        views: Math.floor(Math.random() * 100) + 50,
        likes: Math.floor(Math.random() * 30) + 10,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log(`Created event: ${event.title}`);
    }

    console.log('Seeding gallery items...');
    
    // Add gallery items
    for (let i = 0; i < sampleGalleryItems.length; i++) {
      const item = sampleGalleryItems[i];
      const docRef = doc(db, 'gallery', `gallery-${i + 1}`);
      await setDoc(docRef, {
        ...item,
        views: Math.floor(Math.random() * 80) + 30,
        likes: Math.floor(Math.random() * 25) + 5,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log(`Created gallery item: ${item.title}`);
    }

    // Create statistics document
    console.log('Creating statistics...');
    const statsRef = doc(db, 'statistics', 'general');
    await setDoc(statsRef, {
      totalEvents: sampleEvents.length,
      totalGalleryItems: sampleGalleryItems.length,
      totalTimelineEvents: 0,
      totalViews: 1250,
      totalUsers: 1,
      updatedAt: Timestamp.now(),
    });

    console.log('✅ Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
