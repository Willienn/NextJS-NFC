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
import Link from "next/link";
import {users} from "./users";

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
  const [user, setUser] = useState<{uid: string; amount: number} | null>(null);
  const checkCardId = async (
    cardId: string
  ): Promise<{uid: string; amount: number} | null> => {
    try {
      const user = users.find((data) => data.uid === cardId);
      return user || null;
    } catch (error) {
      console.error("Error checking card id:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!nfcCardData) return;
    const fetchData = async () => {
      const user = await checkCardId(nfcCardData.uid);
      setUser(user);
    };
    fetchData();
  }, [nfcCardData?.uid]);

  console.log("user", user);

  if (!nfcCardData) {
    return (
      <Card
        key="1"
        className="w-full max-w-3xl flex flex-col items-center gap-5 text-slate-100 p-8 border-none bg-zinc-900"
      >
        <CardHeader className="text-2xl">Consult User</CardHeader>
        <CardContent className="flex flex-col items-center">
          <span className="text-xl ">Waiting for NFC card...</span>
          <span className=" text-zinc-400">
            Please, place your NFC card on the reader.
          </span>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card
        key="1"
        className="w-full max-w-3xl flex flex-col items-center gap-5 text-slate-100 p-8 border-none bg-zinc-900"
      >
        <CardHeader className="text-2xl">User Not Found</CardHeader>
        <CardContent className="flex flex-col items-center">
          <span className=" text-zinc-400">
            Please, verify if your NFC card is valid.
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      key="1"
      className="w-full max-w-3xl text-white p-8 border-none bg-zinc-900"
    >
      <CardHeader>
        <CardTitle className="text-2xl">User data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col">
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
  );
}
