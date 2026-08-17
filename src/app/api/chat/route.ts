import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const dynamic = 'force-dynamic'

const SYSTEM_PROMPT = `You are ChefMii Assistant, a helpful AI concierge for the ChefMii private chef booking platform.
ChefMii connects clients with world-class private chefs for intimate dinner parties, date nights, corporate dining, weddings, and family masterclasses.

You help clients and chefs:
- Recommend the best chef based on cuisine, guest count, and city (London, New York, Paris, Dubai, Shanghai, etc.)
- Explain pricing (starting from £70 - £220/hr, with 20% advance deposit option and 100% escrow protection)
- Guide users to join the VIP early access waitlist at /waitlist
- Answer questions about chef booking, dietary menus, and full kitchen cleanup.

Be friendly, concise, warm, and sophisticated. Keep responses under 3-4 sentences unless detailed recommendations are requested.`

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json()

        if (!message) {
            return NextResponse.json({ error: 'Message required' }, { status: 400 })
        }

        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            return NextResponse.json({
                reply: "Welcome to ChefMii! You can explore our roster of verified private chefs on the Find Chefs page or reserve your spot on our VIP waitlist.",
            })
        }

        const genAI = new GoogleGenerativeAI(apiKey)
        let reply = ''

        const modelsToTry = ['gemini-3.5-flash', 'gemini-3.7-flash', 'gemini-3-flash-preview', 'gemini-flash-latest']

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName })
                const result = await model.generateContent([SYSTEM_PROMPT, message])
                reply = result.response.text()
                if (reply) break
            } catch (err) {
                console.warn(`Model ${modelName} failed, attempting next:`, err)
            }
        }

        if (!reply) {
            reply = "Welcome to ChefMii! You can explore our roster of verified private chefs on the Find Chefs page or reserve your spot on our VIP waitlist."
        }

        return NextResponse.json({ reply })
    } catch (error) {
        console.error('Gemini chat error:', error)
        return NextResponse.json(
            { reply: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment." },
            { status: 500 }
        )
    }
}
