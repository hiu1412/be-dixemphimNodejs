import redis from "redis"

// Connect Redis
const client = redis.createClient({
    host: "127.0.0.1", // Địa chỉ Redis
    port: 6379, // Cổng Redis mặc định
    password: "rootredis"
});

client.on("connect", () => {
    console.log("Redis client is ready to use!");
});

await client.connect();

export default client;