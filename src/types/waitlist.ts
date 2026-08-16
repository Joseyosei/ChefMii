export type WaitlistRole = 'chef' | 'business' | 'kid' | 'tutor' | 'client'

export interface WaitlistAddress {
    line1?: string | null
    line2?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
    country?: string | null
}

export interface WaitlistFormData {
    role: WaitlistRole
    fullName: string
    email: string
    phone?: string
    addressLine1?: string
    addressLine2?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
    // Role-specific metadata
    cuisine?: string
    companyName?: string
    eventCount?: string
    parentName?: string
    ageGroup?: string
    specialty?: string
    courseTopic?: string
    occasion?: string
    dietaryPreferences?: string
    notes?: string
}

export interface WaitlistEntry {
    id: string
    name?: string
    fullName: string
    email: string
    phone?: string | null
    role: string
    address?: WaitlistAddress
    metadata?: {
        city?: string | null
        cuisine?: string | null
        company_name?: string | null
        event_count?: string | null
        parent_name?: string | null
        age_group?: string | null
        specialty?: string | null
        course_topic?: string | null
        occasion?: string | null
        dietary_preferences?: string | null
        notes?: string | null
    }
    queuePosition: number
    referralCode: string
    createdAt: string
}

export interface WaitlistSubmissionResponse {
    success: boolean
    message: string
    data?: {
        id: string
        role: WaitlistRole
        fullName: string
        email: string
        phone?: string
        city?: string
        postalCode?: string
        queuePosition: number
        referralCode: string
        referralUrl: string
    }
    error?: string
}
