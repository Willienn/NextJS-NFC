import type { Metadata } from "next"

import "./globals.css"





export const metadata: Metadata = {
  title: "NFC Card Reader",
  description: "A simple NFC card reader application",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="flex h-screen w-screen flex-col items-center justify-center bg-stone-950">
        {children}
      </body>
    </html>
  )
}
