import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import { OpenAI } from "openai"


export type Message = {
    role: 'user' | 'system'
    content: string
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const instructionMessage: Message = {
    role: 'system',
    content: 'You are a code generator, you must answer only in markdown code snippets. Use code comments for explanations.'
}

export async function POST(
    req: Request
) {
    try {
        const {userId} = auth()
        const body = await req.json()
        const {messages} = body
        if (!userId) {
            throw new NextResponse('Unauthorized', {status: 401})
        }

        if (!openai.apiKey) {
            throw new NextResponse('OpenAI api key not configured', {status: 500})
        }

        if (!messages) {
            throw new NextResponse('Message is required', {status: 400})
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [instructionMessage, ...messages]
        })

        return NextResponse.json({role: 'assistant', content: response.choices[0].message.content})
    } catch (error) {
        console.log("[CODE ERROR]", error)
        return new NextResponse(
            "Internal Error",
            {status: 500}
        )
    }
}