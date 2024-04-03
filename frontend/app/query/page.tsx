"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import useSocket from "@/utils/useSocket"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { users } from "./users"


export default function Page() {
  const nfcCardData = useSocket("http://localhost:3001", "nfc-card-read")
  const [user, setUser] = useState<{ uid: string; amount: number } | null>(null)

  const checkCardId = async (
    cardId: string
  ): Promise<{ uid: string; amount: number } | null> => {
    try {
      const user = users.find((data) => data.uid === cardId)
      return user || null
    } catch (error) {
      console.error("Error checking card id:", error)
      return null
    }
  }

  useEffect(() => {
    if (!nfcCardData) return
    const fetchData = async () => {
      const user = await checkCardId(nfcCardData.uid)
      setUser(user)
    }
    fetchData()
  }, [nfcCardData?.uid])

  console.log("user", user)

  if (!nfcCardData) {
    return (
      <div className="flex flex-col items-center justify-center gap-5">
        <Card
          key="1"
          className="flex w-full max-w-3xl flex-col items-center gap-5 border-none bg-zinc-900 p-8 text-slate-100"
        >
          <CardHeader className="text-2xl">Consult User</CardHeader>
          <CardContent className="flex flex-col items-center">
            <span className="text-xl ">Waiting for NFC card...</span>
            <span className=" text-zinc-400">
              Please, place your NFC card on the reader.
            </span>
          </CardContent>
        </Card>
        <Link href="/" className="text-slate-100">
          <Button className="bg-zinc-900">Simple Read</Button>
        </Link>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-5">
        <Card
          key="1"
          className="flex w-full max-w-3xl flex-col items-center gap-5 border-none bg-zinc-900 p-8 text-slate-100"
        >
          <CardHeader className="text-2xl">User Not Found</CardHeader>
          <CardContent className="flex flex-col items-center">
            <span className=" text-zinc-400">
              Please, verify if your NFC card is valid.
            </span>
          </CardContent>
        </Card>
        <Link href="/" className="text-slate-100">
          <Button className="bg-zinc-900">Simple Read</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <Card
        key="1"
        className="w-full max-w-3xl border-none bg-zinc-900 p-8 text-white"
      >
        <CardHeader>
          <CardTitle className="text-2xl">User data</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <span>User: {user.uid}</span>
          <span>Amount: {user.amount}</span>
        </CardContent>
        <CardFooter>
          <Link href="/">
            <Button variant={"secondary"} type="submit">
              Go Back
            </Button>
          </Link>
        </CardFooter>
      </Card>
      <Link href="/" className="text-slate-100">
        <Button className="bg-zinc-900">Simple Read</Button>
      </Link>
    </div>
  )
}
