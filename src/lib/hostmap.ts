import { mongo } from "./db";

export async function siteIdFromHost(host: string, devHostOverride?: string | null) {
  const effectiveHost = (host.includes("localhost") && devHostOverride) ? devHostOverride : host;
  const db = await mongo();
  const site = await db.collection("sites").findOne(
    { $or: [{ primaryDomain: effectiveHost }, { previewDomain: effectiveHost }] },
    { projection: { _id: 1 } }
  );
  return site?._id?.toString() ?? null;
}
