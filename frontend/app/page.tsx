"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import useSocket from "@/utils/useSocket"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"





export default function Page() {
  const nfcCardData = useSocket("http://localhost:3001", "nfc-card-read")
  const [amout, setAmount] = useState(0)

  useEffect(() => {
    setAmount(0)
  }, [nfcCardData])

  if (!nfcCardData) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 ">
        <Card
          key="1"
          className="flex w-full max-w-3xl flex-col items-center gap-5 border-none bg-zinc-900 p-8 text-slate-100"
        >
          <span className="text-xl ">Waiting for NFC card...</span>
          <span>Please, place your NFC card on the reader.</span>
        </Card>
        <Link href="/query" className="text-slate-100">
          <Button className="bg-zinc-900">Simulate Query Database</Button>
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
          <CardTitle className="text-2xl">
            Add funds to user: {nfcCardData?.uid}
          </CardTitle>
          <CardDescription className="text-lg">
            Select the amount you want to add to your card.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-xl">
              Amount: {amout}
            </Label>
            <div className="flex gap-5">
              <Button
                variant={"secondary"}
                onClick={() => setAmount((prev) => prev + 10)}
              >
                10
              </Button>
              <Button
                variant={"secondary"}
                onClick={() => setAmount((prev) => prev + 20)}
              >
                20
              </Button>
              <Button
                variant={"secondary"}
                onClick={() => setAmount((prev) => prev + 50)}
              >
                50
              </Button>
              <Button
                variant={"secondary"}
                onClick={() => setAmount((prev) => prev + 100)}
              >
                100
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant={"secondary"} type="submit">
            Add to card
          </Button>
        </CardFooter>
      </Card>
      <Button className="bg-zinc-900">Simulate Query Database</Button>
    </div>
  )
}
