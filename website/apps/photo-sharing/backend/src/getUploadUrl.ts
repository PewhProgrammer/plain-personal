import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { GetUploadUrlRequest, GetUploadUrlResponse } from "@personal-website/shared-types";
import { success, error } from "./utils/response";
import { getAlbum, addImage, updateAlbum } from "./utils/db";

const s3Client = new S3Client({});
const BUCKET_NAME = process.env.STORAGE_BUCKET!;

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    const albumId = event.pathParameters?.albumId;

    if (!albumId) {
      return error("Album ID is required", 400);
    }

    if (!event.body) {
      return error("Request body is required", 400);
    }

    const request: GetUploadUrlRequest = JSON.parse(event.body);

    if (!request.fileName || !request.contentType) {
      return error("fileName and contentType are required", 400);
    }

    // Verify album exists
    const album = await getAlbum(albumId);
    if (!album) {
      return error("Album not found", 404);
    }

    // Generate unique image ID
    const imageId = uuidv4();
    const fileExtension = request.fileName.split(".").pop() || "";
    const s3Key = `albums/${albumId}/${imageId}.${fileExtension}`;

    // Create presigned URL for upload
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      ContentType: request.contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 600, // 10 minutes
    });

    // Store image metadata
    const image = {
      id: imageId,
      albumId: albumId,
      originalFileName: request.fileName,
      contentType: request.contentType,
      uploadedAt: new Date().toISOString(),
      uploaderName: request.uploaderName,
    };

    await addImage(image);
    await updateAlbum(albumId, { updatedAt: new Date().toISOString() });

    const response: GetUploadUrlResponse = {
      uploadUrl,
      imageId,
      fileKey: s3Key,
    };

    return success(response);
  } catch (err) {
    console.error("Error generating upload URL:", err);
    return error("Failed to generate upload URL", 500);
  }
}
