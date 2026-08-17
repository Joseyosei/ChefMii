import { initializeApp, getApps, getApp, cert, type App } from 'firebase-admin/app'
import { getAuth, type Auth } from 'firebase-admin/auth'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

function getAdminApp(): App {
    if (getApps().length > 0) {
        return getApp()
    }

    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    if (serviceAccountKey) {
        try {
            const decoded = Buffer.from(serviceAccountKey, 'base64').toString('utf-8')
            const serviceAccount = JSON.parse(decoded)
            return initializeApp({
                credential: cert(serviceAccount),
                projectId: serviceAccount.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            })
        } catch (e) {
            console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY base64 JSON:', e)
        }
    }

    return initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'project-c5daea85-d002-4d77-a3f',
    })
}

const adminApp = getAdminApp()
const adminAuth: Auth = getAuth(adminApp)
const adminDb: Firestore = getFirestore(adminApp)

export { adminApp, adminAuth, adminDb }
