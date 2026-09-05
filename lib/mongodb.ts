// Shared MongoDB client. Cached on the global object so that in development
// (and across serverless invocations) we reuse a single connection instead of
// opening a new one on every request / hot-reload.

import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "findmytutor";

// Reuse the promise across hot reloads / warm invocations.
let clientPromise: Promise<MongoClient> | undefined = (
  global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> }
)._mongoClientPromise;

export async function getDb(): Promise<Db> {
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
    (
      global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> }
    )._mongoClientPromise = clientPromise;
  }

  const client = await clientPromise;
  return client.db(dbName);
}
