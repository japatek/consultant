"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { blobToWavFile } from "./attachments"

interface UseVoiceRecorderOptions {
  maxSeconds: number
  /** Called with the finished recording (only when stopped with save = true). */
  onRecorded: (file: File) => void
  onError: (message: string) => void
}

const PREFERRED_TYPES = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"]

export function useVoiceRecorder({ maxSeconds, onRecorded, onError }: UseVoiceRecorderOptions) {
  const [isRecording, setIsRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const elapsedRef = useRef(0)
  const saveRef = useRef(true)

  // Always call the latest callbacks without re-creating start/stop.
  const callbacksRef = useRef({ onRecorded, onError })
  useEffect(() => {
    callbacksRef.current = { onRecorded, onError }
  })

  const release = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = null
    recorderRef.current?.stream.getTracks().forEach((track) => track.stop())
    recorderRef.current = null
    elapsedRef.current = 0
    setStream(null)
    setIsRecording(false)
    setSeconds(0)
  }, [])

  const stop = useCallback(
    (save = true) => {
      const recorder = recorderRef.current
      if (!recorder || recorder.state === "inactive") {
        release()
        return
      }
      saveRef.current = save
      recorder.stop() // finishes in recorder.onstop
    },
    [release],
  )

  const start = useCallback(async () => {
    if (recorderRef.current) return
    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      callbacksRef.current.onError("Voice recording is not supported in this browser.")
      return
    }

    let media: MediaStream
    try {
      media = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      })
    } catch {
      callbacksRef.current.onError("Microphone access denied")
      return
    }

    const mimeType = PREFERRED_TYPES.find((type) => MediaRecorder.isTypeSupported(type))
    const recorder = new MediaRecorder(media, mimeType ? { mimeType } : undefined)
    chunksRef.current = []
    saveRef.current = true

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data)
    }
    recorder.onstop = async () => {
      const shouldSave = saveRef.current
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || mimeType || "audio/webm" })
      release()
      if (!shouldSave || blob.size === 0) return
      try {
        callbacksRef.current.onRecorded(await blobToWavFile(blob, `voice-message-${Date.now()}`))
      } catch {
        callbacksRef.current.onError("Could not process the recording.")
      }
    }

    recorderRef.current = recorder
    recorder.start(250)
    setStream(media)
    setIsRecording(true)

    elapsedRef.current = 0
    timerRef.current = setInterval(() => {
      elapsedRef.current += 1
      setSeconds(elapsedRef.current)
      if (elapsedRef.current >= maxSeconds) stop(true)
    }, 1000)
  }, [maxSeconds, release, stop])

  // Never leave the microphone open if the component goes away mid-recording.
  useEffect(() => {
    return () => {
      saveRef.current = false
      const recorder = recorderRef.current
      if (recorder && recorder.state !== "inactive") recorder.stop()
      recorder?.stream.getTracks().forEach((track) => track.stop())
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return { isRecording, seconds, stream, start, stop }
}