import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import { OpenAI } from "openai"
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit"
import { checkSubscription } from "@/lib/subscription"

export type Message = {
    role: 'user' | 'system'
    content: string
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function POST(
    req: Request
) {
    try {
        const {userId} = auth()
        const body = await req.json()
        const {messages} = body
        if (!userId) {
            return new NextResponse('Unauthorized', {status: 401})
        }

        if (!openai.apiKey) {
            return new NextResponse('OpenAI api key not configured', {status: 500})
        }

        if (!messages) {
            return new NextResponse('Message is required', {status: 400})
        }

        const freeTrail = await checkApiLimit()
        const isPro = await checkSubscription()
        if (!isPro && !freeTrail) {
            return new NextResponse('Free trail has ended', {status: 403})
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages
        })
        if (!isPro) {
            await increaseApiLimit()
        }

        return NextResponse.json({role: 'assistant', content: response.choices[0].message.content})
    } catch (error) {
        console.log("[CONVERSATION ERROR]", error)
        return new NextResponse(
            "Internal Error",
            {status: 500}
        )
    }
}