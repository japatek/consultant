import { NextRequest, NextResponse } from "next/server"
import { Groq } from "groq-sdk"

// Explicitly instruct Next.js to treat this route as dynamic
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      console.error("GROQ_API_KEY is not defined in environment variables.")
      return NextResponse.json(
        { error: "Server configuration error: missing API key" },
        { status: 500 }
      )
    }

    const client = new Groq({ apiKey })

    const formData = await req.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      )
    }

    const transcription = await client.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3-turbo",
      language: "en",
      response_format: "json",
      temperature: 0.0,
    })

    return NextResponse.json({ text: transcription.text })
  } catch (error) {
    console.error("Transcription error:", error)
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 }
    )
  }
}