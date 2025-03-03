import config from '~/config';
import { getConnection } from './packages/database';
import server from './server';

const PORT = config.SERVER_PORT || '3000';
 
async function onStart(): Promise<any> {
  try {
    await getConnection();
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
}

server.listen(PORT, async () => {
  await onStart();
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
 