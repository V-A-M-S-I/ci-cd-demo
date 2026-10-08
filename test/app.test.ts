import assert from 'node:assert/strict';
import { once } from 'node:events';
import { test } from 'node:test';
import app from '../src/app.js';

test('GET /api/health returns a healthy response', async () => {
  const server = app.listen(0, '127.0.0.1');

  try {
    await once(server, 'listening');

    const address = server.address();

    if (!address || typeof address === 'string') {
      throw new Error('Could not determine the test server port');
    }

    const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      status: 'ok',
    });
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
});
