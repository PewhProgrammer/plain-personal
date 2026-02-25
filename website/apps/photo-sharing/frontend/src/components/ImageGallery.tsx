import React, { useState } from 'react'
import { Image } from '@personal-website/shared-types'
import { apiClient } from '../api/client'

interface ImageGalleryProps {
  albumId: string
  images: Image[]
}

function ImageGallery({ albumId, images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})

  const loadImageUrl = async (imageId: string) => {
    if (imageUrls[imageId]) {
      return imageUrls[imageId]
    }

    try {
      const { downloadUrl } = await apiClient.getDownloadUrl(albumId, imageId)
      setImageUrls((prev) => ({ ...prev, [imageId]: downloadUrl }))
      return downloadUrl
    } catch (error) {
      console.error('Failed to load image URL:', error)
      return ''
    }
  }

  const handleImageClick = async (imageId: string) => {
    const url = await loadImageUrl(imageId)
    setSelectedImage(url)
  }

  // Load thumbnail URLs on mount
  React.useEffect(() => {
    images.forEach((image) => {
      loadImageUrl(image.id)
    })
  }, [images])

  return (
    <>
      <div className="image-grid">
        {images.map((image) => (
          <div
            key={image.id}
            className="image-item"
            onClick={() => handleImageClick(image.id)}
          >
            {imageUrls[image.id] ? (
              <img src={imageUrls[image.id]} alt={image.originalFileName} />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f0f0f0',
                }}
              >
                Loading...
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedImage(null)}>
              ×
            </button>
            <img src={selectedImage} alt="Full size" />
          </div>
        </div>
      )}
    </>
  )
}

export default ImageGallery
