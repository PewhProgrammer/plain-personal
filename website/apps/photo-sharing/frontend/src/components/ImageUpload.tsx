import React, { useState } from 'react'
import { apiClient } from '../api/client'

interface ImageUploadProps {
  albumId: string
  onUploadComplete: () => void
}

interface UploadingFile {
  file: File
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

function ImageUpload({ albumId, onUploadComplete }: ImageUploadProps) {
  const [files, setFiles] = useState<UploadingFile[]>([])
  const [uploaderName, setUploaderName] = useState('')

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const newFiles = selectedFiles.map((file) => ({
      file,
      status: 'pending' as const,
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }

  const handleUpload = async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending')

    for (let i = 0; i < pendingFiles.length; i++) {
      const fileEntry = pendingFiles[i]
      const fileIndex = files.indexOf(fileEntry)

      // Update status to uploading
      setFiles((prev) => {
        const updated = [...prev]
        updated[fileIndex] = { ...updated[fileIndex], status: 'uploading' }
        return updated
      })

      try {
        // Get upload URL
        const { uploadUrl } = await apiClient.getUploadUrl(albumId, {
          fileName: fileEntry.file.name,
          contentType: fileEntry.file.type,
          uploaderName: uploaderName || undefined,
        })

        // Upload file directly to S3
        await apiClient.uploadFile(uploadUrl, fileEntry.file)

        // Update status to success
        setFiles((prev) => {
          const updated = [...prev]
          updated[fileIndex] = { ...updated[fileIndex], status: 'success' }
          return updated
        })
      } catch (error) {
        // Update status to error
        setFiles((prev) => {
          const updated = [...prev]
          updated[fileIndex] = {
            ...updated[fileIndex],
            status: 'error',
            error: error instanceof Error ? error.message : 'Upload failed',
          }
          return updated
        })
      }
    }

    // Refresh album after all uploads
    onUploadComplete()

    // Clear successful uploads
    setTimeout(() => {
      setFiles((prev) => prev.filter((f) => f.status !== 'success'))
    }, 2000)
  }

  const hasPendingFiles = files.some((f) => f.status === 'pending')
  const isUploading = files.some((f) => f.status === 'uploading')

  return (
    <div className="card">
      <h3>Upload Photos</h3>

      <div className="form-group">
        <label htmlFor="uploaderName">Your Name (Optional)</label>
        <input
          id="uploaderName"
          type="text"
          value={uploaderName}
          onChange={(e) => setUploaderName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>

      <div
        className="upload-area"
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
        />
        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</p>
        <p style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          Click to select photos
        </p>
        <p style={{ color: '#666' }}>or drag and drop them here</p>
      </div>

      {files.length > 0 && (
        <div className="file-list">
          {files.map((file, index) => (
            <div key={index} className="file-item">
              <span className="file-item-name">{file.file.name}</span>
              <span className="file-item-status">
                {file.status === 'pending' && '⏳ Pending'}
                {file.status === 'uploading' && '⬆️ Uploading...'}
                {file.status === 'success' && '✅ Uploaded'}
                {file.status === 'error' && `❌ ${file.error}`}
              </span>
            </div>
          ))}
        </div>
      )}

      {hasPendingFiles && (
        <button
          className="button"
          onClick={handleUpload}
          disabled={isUploading}
          style={{ marginTop: '1rem' }}
        >
          {isUploading ? 'Uploading...' : 'Upload All'}
        </button>
      )}
    </div>
  )
}

export default ImageUpload
