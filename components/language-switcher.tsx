"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { locales } from "@/middleware"
import { Globe } from "lucide-react"

interface LanguageSwitcherProps {
  currentLang: string
}

// Language flag emojis mapping
const LanguageFlags: Record<string, string> = {
  en: "🇺🇸",
  "pt-br": "🇧🇷",
}

export function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const pathName = usePathname()
  const router = useRouter()

  const switchLanguage = (locale: string) => {
    if (locale === currentLang) return

    // Replace the locale in the current path
    const newPath = pathName.replace(`/${currentLang}`, `/${locale}`)
    router.push(newPath)
  }

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-gray-500 mr-1" />
      {locales.map((locale) => (
        <Button
          key={locale}
          variant={locale === currentLang ? "default" : "outline"}
          size="sm"
          onClick={() => switchLanguage(locale)}
          className={`${locale === currentLang ? "bg-gray-200 text-gray-800" : "bg-white"} flex items-center gap-1`}
        >
          <span className="text-lg mr-1">{LanguageFlags[locale]}</span>
          <span className="text-xs uppercase">{locale === "pt-br" ? "PT" : locale}</span>
        </Button>
      ))}
    </div>
  )
}
