// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: 'dmyejrbs7',
  UPLOAD_PRESET: 'apuntes',
  API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

// Cloudinary upload function
export const uploadToCloudinary = async (file: File, folder?: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);
  if (folder) {
    formData.append('folder', folder);
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Widget upload function using Cloudinary Upload Widget
export const openCloudinaryWidget = (
  onSuccess: (url: string) => void,
  onError?: (error: any) => void
) => {
  if (typeof window !== 'undefined' && (window as any).cloudinary) {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CONFIG.CLOUD_NAME,
        uploadPreset: CLOUDINARY_CONFIG.UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        maxFiles: 1,
        resourceType: 'image',
        clientAllowedFormats: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
        maxFileSize: 10000000, // 10MB
        folder: 'cultura-uacam',
      },
      (error: any, result: any) => {
        if (error && onError) {
          onError(error);
          return;
        }
        
        if (result && result.event === 'success') {
          onSuccess(result.info.secure_url);
          widget.close();
        }
      }
    );

    widget.open();
  } else {
    console.error('Cloudinary widget not loaded');
  }
};
