import { redirect } from "next/navigation"
import { match } from "@formatjs/intl-localematcher"

export const locales = ["en", "pt-br"]
export const defaultLocale = "en"

function getLocale() {
  return match(navigator.languages, locales, defaultLocale)
}

export default function Home() {
  redirect(`/${getLocale()}`)
}
