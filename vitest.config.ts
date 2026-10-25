import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    fileParallelism: false,
    env: {
      JWT_SECRET: 'test-secret-only-for-tests',
      NODE_ENV:"test",
      DB_HOST:"localhost",
      DB_PORT:"5432",
      DB_NAME:"postgres",
      DB_USER:"postgres",
      DB_PASS:"123456789",
      PORT:"3000"

    },
  },
});