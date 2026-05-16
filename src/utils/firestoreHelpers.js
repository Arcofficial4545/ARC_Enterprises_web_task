/**
 * Wraps a Firestore promise with a timeout to prevent infinite hanging
 * when the Firestore database is not provisioned or unreachable.
 */
export function withTimeout(promise, ms = 10000) {
  const timeout = new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error('Firestore operation timed out. Please ensure your Firestore database is created in the Firebase Console (Firestore Database → Create database).')),
      ms
    )
  )
  return Promise.race([promise, timeout])
}
