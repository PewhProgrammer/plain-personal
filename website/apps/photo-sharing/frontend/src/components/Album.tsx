import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { GetAlbumResponse, Image } from '@personal-website/shared-types'
import { apiClient } from '../api/client'
import ImageUpload from './ImageUpload'
import ImageGallery from './ImageGallery'

function Album() {
  const { albumId } = useParams<{ albumId: string }>()
  const [album, setAlbum] = useState<GetAlbumResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadAlbum()
  }, [albumId])

  const loadAlbum = async () => {
    if (!albumId) return

    setLoading(true)
    setError('')

    try {
      const data = await apiClient.getAlbum(albumId)
      setAlbum(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load album')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadComplete = () => {
    loadAlbum()
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading album...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    )
  }

  if (!album) {
    return (
      <div className="container">
        <div className="error">Album not found</div>
      </div>
    )
  }

  const shareUrl = `${window.location.origin}/albums/${albumId}`

  return (
    <div className="container">
      <div className="card">
        <h2>{album.album.title}</h2>
        {album.album.description && (
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            {album.album.description}
          </p>
        )}
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '6px' }}>
          <strong>Share this album:</strong>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="text"
              value={shareUrl}
              readOnly
              style={{ flex: 1 }}
            />
            <button
              className="button"
              onClick={() => {
                navigator.clipboard.writeText(shareUrl)
                alert('Link copied to clipboard!')
              }}
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>

      <ImageUpload albumId={albumId!} onUploadComplete={handleUploadComplete} />

      <div className="card">
        <h3>Photos ({album.images.length})</h3>
        {album.images.length === 0 ? (
          <p style={{ color: '#666', marginTop: '1rem' }}>
            No photos yet. Upload some to get started!
          </p>
        ) : (
          <ImageGallery albumId={albumId!} images={album.images} />
        )}
      </div>
    </div>
  )
}

export default Album
