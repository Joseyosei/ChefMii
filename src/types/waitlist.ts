export type WaitlistRole = 'chef' | 'business' | 'kid' | 'tutor' | 'client'

export interface WaitlistFormData {
    role: WaitlistRole
    fullName: string
    email: string
    // Optional role-specific metadata
    city?: string
    cuisine?: string
    companyName?: string
    eventCount?: string
    parentName?: string
    ageGroup?: string
    specialty?: string
    courseTopic?: string
    occasion?: string
}

export interface WaitlistSubmissionResponse {
    success: boolean
    message: string
    data?: {
        id: string
        role: WaitlistRole
        fullName: string
        email: string
        queuePosition: number
        referralCode: string
        referralUrl: string
    }
    error?: string
}
