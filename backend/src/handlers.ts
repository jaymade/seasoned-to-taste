import { randomUUID } from "node:crypto";
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const tableName = process.env.RECIPES_TABLE;
if (!tableName) throw new Error("RECIPES_TABLE is required");
const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));

type Recipe = Record<string, unknown> & {
  id: string;
  authorId: string;
  isPublic: boolean;
};
type AuthenticatedRequestContext = APIGatewayProxyEventV2["requestContext"] & {
  authorizer?: { jwt?: { claims?: Record<string, string> } };
};
const response = (
  statusCode: number,
  body: unknown,
): APIGatewayProxyStructuredResultV2 => ({
  statusCode,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});
const claims = (event: APIGatewayProxyEventV2) =>
  (event.requestContext as AuthenticatedRequestContext).authorizer?.jwt?.claims;
const userId = (event: APIGatewayProxyEventV2) => claims(event)?.sub;

export const handler = async (event: APIGatewayProxyEventV2) => {
  const method = event.requestContext.http.method;
  const id = event.pathParameters?.id;

  if (method === "GET" && id === "mine") {
    const ownerId = userId(event);
    if (!ownerId) return response(401, { message: "Authentication required" });
    const result = await db.send(new ScanCommand({ TableName: tableName }));
    return response(
      200,
      (result.Items ?? []).filter((recipe) => recipe.authorId === ownerId),
    );
  }

  if (method === "GET" && id) {
    const result = await db.send(
      new GetCommand({ TableName: tableName, Key: { id } }),
    );
    const ownerId = userId(event);
    if (
      !result.Item ||
      (!result.Item.isPublic && result.Item.authorId !== ownerId)
    ) {
      return response(404, { message: "Recipe not found" });
    }
    return response(200, result.Item);
  }

  if (method === "GET") {
    const result = await db.send(new ScanCommand({ TableName: tableName }));
    return response(
      200,
      (result.Items ?? []).filter((recipe) => recipe.isPublic),
    );
  }

  const ownerId = userId(event);
  if (!ownerId) return response(401, { message: "Authentication required" });

  if (method === "POST") {
    const recipe = JSON.parse(event.body ?? "{}") as Record<string, unknown>;
    const item: Recipe = {
      ...recipe,
      id: randomUUID(),
      authorId: ownerId,
      isPublic: Boolean(recipe.isPublic ?? true),
    };
    await db.send(new PutCommand({ TableName: tableName, Item: item }));
    return response(201, item);
  }

  if (!id) return response(400, { message: "Recipe id is required" });
  const existing = await db.send(
    new GetCommand({ TableName: tableName, Key: { id } }),
  );
  if (!existing.Item || existing.Item.authorId !== ownerId)
    return response(404, { message: "Recipe not found" });

  if (method === "DELETE") {
    await db.send(new DeleteCommand({ TableName: tableName, Key: { id } }));
    return { statusCode: 204 };
  }

  if (method === "PUT") {
    const updates = JSON.parse(event.body ?? "{}") as Partial<Recipe>;
    const item = { ...existing.Item, ...updates, id, authorId: ownerId };
    await db.send(new PutCommand({ TableName: tableName, Item: item }));
    return response(200, item);
  }

  return response(405, { message: "Method not allowed" });
};
