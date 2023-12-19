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
        const {prompt, amount="1", resolution="1024x1024"} = body
        if (!userId) {
            return new NextResponse('Unauthorized', {status: 401})
        }

        if (!openai.apiKey) {
            return new NextResponse('OpenAI api key not configured', {status: 500})
        }

        if (!prompt) {
            return new NextResponse('Prompt is required', {status: 400})
        }

        if (!amount) {
            return new NextResponse('Amount is required', {status: 400})
        }

        if (!resolution) {
            return new NextResponse('Resolution is required', {status: 400})
        }

        const freeTrail = await checkApiLimit()
        const isPro = await checkSubscription()
        if (!isPro && !freeTrail) {
            return new NextResponse('Free trail has ended', {status: 403})
        }
        
        if (!isPro) {
            await increaseApiLimit()
        }

        const response = await openai.images.generate({
            model: "dall-e-2",
            prompt: prompt,
            n: parseInt(amount),
            size: resolution
        })

        return NextResponse.json(response.data)
    } catch (error) {
        console.log("[CONVERSATION ERROR]", error)
        return new NextResponse(
            "Internal Error",
            {status: 500}
        )
    }
}