"use client"

import { useEffect, useState } from "react"
import io, { Socket } from "socket.io-client"





interface CardData {
  atr: string
  standard: string
  type: string
  uid: string
}

export default function useSocket(url: string, event: string): CardData | null {
  const [cardData, setCardData] = useState<CardData | null>(null)
  const [prevUid, setPrevUid] = useState<string | null>(null)

  useEffect(() => {
    const socket: Socket = io(url)

    socket.on(event, (data: CardData) => {
      if (data.uid !== prevUid) {
        setCardData(data)
        setPrevUid(data.uid)
      }
    })

    socket.on("connect_error", (err: Error) => {
      console.log(`Connection Error: ${err.message}`)
    })

    return () => {
      socket.disconnect()
    }
  }, [url, event, prevUid])

  return cardData
}
