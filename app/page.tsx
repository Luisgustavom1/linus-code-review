import { redirect } from "next/navigation"
import { match } from "@formatjs/intl-localematcher"

 const locales = ["en", "pt-br"]
const defaultLocale = "en"

function getLocale() {
  return match(navigator.languages, locales, defaultLocale)
}

export default function Home() {
  redirect(`/${getLocale()}`)
}
