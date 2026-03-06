import "./env"; // 環境変数ロード（単一エントリポイント）
import admin from "firebase-admin";
import { logger } from "./logger";

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID ?? "";
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL ?? "";
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY ?? "";

  let privateKey: string | undefined;
  if (rawPrivateKey) {
    try {
      const maybeDecoded = Buffer.from(rawPrivateKey, "base64").toString("utf8");
      if (
        maybeDecoded.includes("-----BEGIN") &&
        maybeDecoded.includes("PRIVATE KEY-----")
      ) {
        privateKey = maybeDecoded;
      } else {
        privateKey = rawPrivateKey.replace(/\\n/g, "\n");
      }
    } catch {
      privateKey = rawPrivateKey.replace(/\\n/g, "\n");
    }
  }

  try {
    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      });
      logger.info(
        "[firebase] Firebase Admin SDK initialized with service account credentials"
      );
    } else {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      logger.warn(
        "[firebase] Using Application Default Credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY to use service account cert."
      );
    }
  } catch (e) {
    logger.error({ err: e }, "[firebase] Firebase Admin SDK initialization failed");
    // サービスアカウント認証に失敗した場合は ADC にフォールバック
    try {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
        });
        logger.warn(
          "[firebase] Falling back to Application Default Credentials after cert failure."
        );
      }
    } catch (fallbackError) {
      logger.error({ err: fallbackError }, "[firebase] ADC fallback also failed");
      logger.warn(
        "[firebase] Firebase Admin SDK initialization failed. Authentication will not work properly."
      );
    }
  }
}

export default admin;
