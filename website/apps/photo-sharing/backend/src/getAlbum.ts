import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { GetAlbumResponse } from "@personal-website/shared-types";
import { success, error } from "./utils/response";
import { getAlbum, listImages } from "./utils/db";

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    const albumId = event.pathParameters?.albumId;

    if (!albumId) {
      return error("Album ID is required", 400);
    }

    const [album, images] = await Promise.all([
      getAlbum(albumId),
      listImages(albumId),
    ]);

    if (!album) {
      return error("Album not found", 404);
    }

    const response: GetAlbumResponse = {
      album,
      images,
    };

    return success(response);
  } catch (err) {
    console.error("Error getting album:", err);
    return error("Failed to get album", 500);
  }
}
