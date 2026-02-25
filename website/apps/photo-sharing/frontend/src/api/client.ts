import {
  CreateAlbumRequest,
  CreateAlbumResponse,
  GetAlbumResponse,
  GetUploadUrlRequest,
  GetUploadUrlResponse,
  GetDownloadUrlResponse,
} from '@personal-website/shared-types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

class APIClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async createAlbum(request: CreateAlbumRequest): Promise<CreateAlbumResponse> {
    const response = await fetch(`${this.baseUrl}/albums`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create album')
    }

    return response.json()
  }

  async getAlbum(albumId: string): Promise<GetAlbumResponse> {
    const response = await fetch(`${this.baseUrl}/albums/${albumId}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to get album')
    }

    return response.json()
  }

  async getUploadUrl(
    albumId: string,
    request: GetUploadUrlRequest
  ): Promise<GetUploadUrlResponse> {
    const response = await fetch(`${this.baseUrl}/albums/${albumId}/upload-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to get upload URL')
    }

    return response.json()
  }

  async uploadFile(uploadUrl: string, file: File): Promise<void> {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    })

    if (!response.ok) {
      throw new Error('Failed to upload file')
    }
  }

  async getDownloadUrl(
    albumId: string,
    imageId: string
  ): Promise<GetDownloadUrlResponse> {
    const response = await fetch(
      `${this.baseUrl}/albums/${albumId}/download-url/${imageId}`
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to get download URL')
    }

    return response.json()
  }
}

export const apiClient = new APIClient(API_BASE_URL)
