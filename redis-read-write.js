// npm install redis

// docker run --name redis1 -d -p 6379:6379 redis

const redis = require('redis');

const client = redis.createClient({ url: 'redis://localhost:6379' });

client.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  console.log('Connect to Redis');
  await client.connect();

  await client.set('username', 'tarsislimadev');
  const value = await client.get('username');
  console.log('Stored username:', value);

  console.log('Destroy Redis');
  client.destroy();
})();
