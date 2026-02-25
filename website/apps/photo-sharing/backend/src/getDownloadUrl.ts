import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetDownloadUrlResponse } from "@personal-website/shared-types";
import { success, error } from "./utils/response";
import { getImage } from "./utils/db";

const s3Client = new S3Client({});
const BUCKET_NAME = process.env.STORAGE_BUCKET!;

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    const albumId = event.pathParameters?.albumId;
    const imageId = event.pathParameters?.imageId;

    if (!albumId || !imageId) {
      return error("Album ID and Image ID are required", 400);
    }

    // Get image metadata
    const image = await getImage(albumId, imageId);
    if (!image) {
      return error("Image not found", 404);
    }

    // Construct S3 key
    const fileExtension = image.originalFileName.split(".").pop() || "";
    const s3Key = `albums/${albumId}/${imageId}.${fileExtension}`;

    // Create presigned URL for download
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    });

    const downloadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hour
    });

    const response: GetDownloadUrlResponse = {
      downloadUrl,
      image,
    };

    return success(response);
  } catch (err) {
    console.error("Error generating download URL:", err);
    return error("Failed to generate download URL", 500);
  }
}
