console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
if (process.env.DATABASE_URL) {
  console.log('First 30 chars:', process.env.DATABASE_URL.substring(0, 30) + '...');
}
