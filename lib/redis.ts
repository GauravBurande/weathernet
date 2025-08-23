import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient> | null = null;

export async function getRedisClient(): Promise<ReturnType<
  typeof createClient
> | null> {
  try {
    if (redisClient) return redisClient;

    const host = process.env.REDIS_HOST;
    const port = 13268;
    const username = "default";
    const password = process.env.REDIS_PASSWORD;

    if (!host || !port || !password) {
      console.warn("⚠️ Redis env vars missing. Skipping Redis connection.");
      return null;
    }

    const socket = { host, port };

    const client = createClient({
      username: username || undefined,
      password,
      socket: socket as any,
    });

    client.on("error", (err) => console.error("Redis Client Error", err));
    await client.connect();

    redisClient = client;
    return redisClient;
  } catch (error) {
    console.error("❌ Failed to init Redis client:", error);
    return null;
  }
}
/**
 * Store an object in Redis using its key.
 * Overwrites existing data for that key.
 */
export async function setRedisObject(
  key: string,
  value: string,
  ttlSeconds?: number
): Promise<void> {
  const client = await getRedisClient();
  if (!client) return;

  if (!key) {
    throw new Error("❌ setRedisObject: object must have a key");
  }

  if (ttlSeconds) {
    await client.set(key, value, { EX: ttlSeconds });
  } else {
    await client.set(key, value);
  }
}

/**
 * Retrieve an object from Redis by key.
 */
export async function getRedisObject<T = any>(key: string): Promise<T | null> {
  const client = await getRedisClient();
  if (!client) return null;

  const data = await client.get(key);
  return data ? (JSON.parse(data) as T) : null;
}

export async function addDeviceReading(
  device_id: string,
  reading: Record<string, any>
): Promise<void> {
  const client = await getRedisClient();
  if (!client) return;

  const serialized = JSON.stringify({ ...reading, device_id });
  await client.rPush(device_id, serialized); // append to the list
}

/**
 * Get all readings for a device_id.
 */
export async function getDeviceReadings<T = any>(
  device_id: string
): Promise<T[]> {
  const client = await getRedisClient();
  if (!client) return [];

  const values = await client.lRange(device_id, 0, -1); // all list items
  return values.map((val) => JSON.parse(val) as T);
}

/**
 * Get the latest N readings for a device_id.
 */
export async function getLatestDeviceReadings<T = any>(
  device_id: string,
  limit: number
): Promise<T[]> {
  const client = await getRedisClient();
  if (!client) return [];

  const values = await client.lRange(device_id, -limit, -1); // last N
  return values.map((val) => JSON.parse(val) as T);
}
