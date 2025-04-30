import { redirect } from "next/navigation"
import { defaultLocale } from "@/middleware"

export default function Home() {
  // Redirect to the default locale
  redirect(`/${defaultLocale}`)
}
