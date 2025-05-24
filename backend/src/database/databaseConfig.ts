import admin from 'firebase-admin';
import 'dotenv/config';

const databaseConfig = admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.URL_FIREBASE_CREDENTIALS || ''),
  ),
});

export default databaseConfig;
