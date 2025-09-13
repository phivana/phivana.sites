import { MongoClient } from "mongodb";

let client: MongoClient | null = null;

export async function mongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not set");
  if (!client) client = new MongoClient(uri);
  // @ts-expect-error topology is runtime-only
  if (!client.topology) await client.connect();
  const dbName = process.env.MONGODB_DB || "phivana_sites";
  return client.db(dbName);
}
