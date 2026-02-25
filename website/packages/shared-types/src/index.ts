// Album types
export interface Album {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlbumRequest {
  title: string;
  description?: string;
}

export interface CreateAlbumResponse {
  albumId: string;
  title: string;
  description?: string;
  createdAt: string;
}

// Image types
export interface Image {
  id: string;
  albumId: string;
  originalFileName: string;
  contentType: string;
  uploadedAt: string;
  uploaderName?: string;
  size?: number;
}

export interface GetAlbumResponse {
  album: Album;
  images: Image[];
}

export interface ListImagesResponse {
  images: Image[];
}

// Presigned URL types
export interface GetUploadUrlRequest {
  fileName: string;
  contentType: string;
  uploaderName?: string;
}

export interface GetUploadUrlResponse {
  uploadUrl: string;
  imageId: string;
  fileKey: string;
}

export interface GetDownloadUrlResponse {
  downloadUrl: string;
  image: Image;
}

// API Error
export interface APIError {
  error: string;
  message: string;
  statusCode: number;
}

// Frontend configuration
export interface AppConfig {
  apiBaseUrl: string;
  landingPageUrl: string;
  photoSharingUrl: string;
}
