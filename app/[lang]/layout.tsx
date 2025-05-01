import type React from "react"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Linus Code Review",
  description: "Get your pull request brutally reviewed by Linus Torvalds",
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <html lang={slug}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="luisao" data-color="#FFDD00" data-emoji=""  data-font="Cookie" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff" ></Script>
        </ThemeProvider>
      </body>
    </html>
  )
}
