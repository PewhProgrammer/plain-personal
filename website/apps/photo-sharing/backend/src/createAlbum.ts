import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { CreateAlbumRequest, CreateAlbumResponse } from "@personal-website/shared-types";
import { success, error } from "./utils/response";
import { createAlbum } from "./utils/db";

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  try {
    if (!event.body) {
      return error("Request body is required", 400);
    }

    const request: CreateAlbumRequest = JSON.parse(event.body);

    if (!request.title || request.title.trim() === "") {
      return error("Album title is required", 400);
    }

    const albumId = uuidv4();
    const now = new Date().toISOString();

    const album = {
      id: albumId,
      title: request.title.trim(),
      description: request.description?.trim(),
      createdAt: now,
      updatedAt: now,
    };

    await createAlbum(album);

    const response: CreateAlbumResponse = {
      albumId: album.id,
      title: album.title,
      description: album.description,
      createdAt: album.createdAt,
    };

    return success(response, 201);
  } catch (err) {
    console.error("Error creating album:", err);
    return error("Failed to create album", 500);
  }
}
