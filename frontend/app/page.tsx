"use client";
import React, {useState, useEffect} from "react";
import io, {Socket} from "socket.io-client";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
interface CardData {
  atr: string;
  standard: string;
  type: string;
  uid: string;
}

const useSocket = (url: string, event: string): CardData | null => {
  const [data, setData] = useState<CardData | null>(null);

  useEffect(() => {
    const socket: Socket = io(url);

    socket.on(event, (data: CardData) => {
      setData(data);
    });

    socket.on("connect_error", (err: Error) => {
      console.log(`Connection Error: ${err.message}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [url, event]);

  return data;
};

export default function Page() {
  const nfcCardData = useSocket("http://localhost:3001", "nfc-card-read");
  const [amout, setAmount] = useState(0);

  console.log(nfcCardData);

  if (!nfcCardData) {
    return (
      <Card
        key="1"
        className="w-full max-w-3xl flex flex-col items-center gap-5 text-slate-100 p-8 border-none bg-zinc-900"
      >
        <span className="text-xl ">Waiting for NFC card...</span>
        <span>Please, place your NFC card on the reader.</span>
      </Card>
    );
  }
  return (
    <Card
      key="1"
      className="w-full max-w-3xl text-white p-8 border-none bg-zinc-900"
    >
      <CardHeader>
        <CardTitle className="text-2xl">
          Add funds to user: {nfcCardData.uid}
        </CardTitle>
        <CardDescription className="text-lg">
          Select the amount you want to add to your prepaid card.
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
  );
}
