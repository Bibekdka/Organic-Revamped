import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

/**
 * Firebase App Initialization
 * Using configuration from the auto-generated firebase-applet-config.json
 */
const app = initializeApp(firebaseConfig);

// Main Firestore instance
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Auth instance
export const auth = getAuth();

/**
 * Firestore Operation Types for detailed error logging
 */
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

/**
 * Enhanced error handler for Firestore operations.
 * Required by platform guidelines for better debugging and security rule validation.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  
  console.error('Firestore Error Detailed: ', JSON.stringify(errInfo, null, 2));
  
  // Re-throw as a JSON string to allow the system or parent components to parse it
  throw new Error(JSON.stringify(errInfo));
}
