import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../api/client'

function Home() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await apiClient.createAlbum({
        title,
        description: description || undefined,
      })
      navigate(`/albums/${response.albumId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create album')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ marginBottom: '1rem' }}>Create a New Album</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Create a photo album and share it with anyone via a link. No sign-up required!
        </p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleCreateAlbum}>
          <div className="form-group">
            <label htmlFor="title">Album Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Summer Vacation 2024"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for your album..."
              rows={3}
            />
          </div>

          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Creating...' : 'Create Album'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Have an album link?</h3>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Paste the album URL in your browser to view or add photos.
        </p>
      </div>
    </div>
  )
}

export default Home
