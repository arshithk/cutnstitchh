import * as dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
  const uri = process.env.MONGODB_URI;

  console.log(`MONGODB_URI exists: ${Boolean(uri)}`);

  if (!uri) {
    console.error('No MONGODB_URI was found in .env.local.');
    process.exitCode = 1;
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed.');
    console.error(error);
    process.exitCode = 1;
  } finally {
    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      console.error('Failed to disconnect cleanly.');
      console.error(disconnectError);
    }
  }
}

main().catch((error) => {
  console.error('Unexpected error while running DB diagnostic.');
  console.error(error);
  process.exitCode = 1;
});
