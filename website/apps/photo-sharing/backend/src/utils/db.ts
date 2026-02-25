import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { Album, Image } from "@personal-website/shared-types";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.METADATA_TABLE!;

// DynamoDB Single Table Design:
// PK                    SK                  Entity Type
// ALBUM#{albumId}       METADATA           Album
// ALBUM#{albumId}       IMAGE#{imageId}    Image

export async function createAlbum(album: Album): Promise<void> {
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `ALBUM#${album.id}`,
        SK: "METADATA",
        ...album,
        entityType: "Album",
      },
    })
  );
}

export async function getAlbum(albumId: string): Promise<Album | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `ALBUM#${albumId}`,
        SK: "METADATA",
      },
    })
  );

  if (!result.Item) {
    return null;
  }

  const { PK, SK, entityType, ...album } = result.Item;
  return album as Album;
}

export async function updateAlbum(
  albumId: string,
  updates: Partial<Album>
): Promise<void> {
  await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `ALBUM#${albumId}`,
        SK: "METADATA",
      },
      UpdateExpression: "set updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":updatedAt": new Date().toISOString(),
      },
    })
  );
}

export async function addImage(image: Image): Promise<void> {
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `ALBUM#${image.albumId}`,
        SK: `IMAGE#${image.id}`,
        ...image,
        entityType: "Image",
      },
    })
  );
}

export async function getImage(
  albumId: string,
  imageId: string
): Promise<Image | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `ALBUM#${albumId}`,
        SK: `IMAGE#${imageId}`,
      },
    })
  );

  if (!result.Item) {
    return null;
  }

  const { PK, SK, entityType, ...image } = result.Item;
  return image as Image;
}

export async function listImages(albumId: string): Promise<Image[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": `ALBUM#${albumId}`,
        ":sk": "IMAGE#",
      },
    })
  );

  if (!result.Items) {
    return [];
  }

  return result.Items.map((item) => {
    const { PK, SK, entityType, ...image } = item;
    return image as Image;
  });
}
