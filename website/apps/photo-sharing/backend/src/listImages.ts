import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { ListImagesResponse } from "@personal-website/shared-types";
import { success, error } from "./utils/response";
import { listImages, getAlbum } from "./utils/db";

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    const albumId = event.pathParameters?.albumId;

    if (!albumId) {
      return error("Album ID is required", 400);
    }

    // Verify album exists
    const album = await getAlbum(albumId);
    if (!album) {
      return error("Album not found", 404);
    }

    const images = await listImages(albumId);

    const response: ListImagesResponse = {
      images,
    };

    return success(response);
  } catch (err) {
    console.error("Error listing images:", err);
    return error("Failed to list images", 500);
  }
}
