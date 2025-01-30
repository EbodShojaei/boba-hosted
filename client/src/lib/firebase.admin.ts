import admin from "firebase-admin";

let adminApp: admin.app.App;

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT || "{}",
  );

  adminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  adminApp = admin.app();
}

export const adminDb = adminApp.firestore();
