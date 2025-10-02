// services/firebase.ts
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase 設定の検証
const requiredEnvVars = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase 設定
const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey as string,
  authDomain: requiredEnvVars.authDomain as string,
  projectId: requiredEnvVars.projectId as string,
  storageBucket: requiredEnvVars.storageBucket as string,
  messagingSenderId: requiredEnvVars.messagingSenderId as string,
  appId: requiredEnvVars.appId as string,
};

// 環境変数の検証
const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingEnvVars.length > 0) {
  console.error("Firebase環境変数が不足しています:", missingEnvVars);
}

// Firebase アプリ初期化（既に初期化済みの場合は再利用）
export const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Firebase Auth
export const auth = getAuth(app);

// Firebase Firestore
export const db = getFirestore(app);

// ログイン中のユーザーのIDトークンを取得
export const getIdToken = async (): Promise<string | null> => {
  if (!auth.currentUser) return null;
  return await auth.currentUser.getIdToken();
};
