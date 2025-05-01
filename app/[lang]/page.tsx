import { PrAnalyzer } from "@/components/pr-analyzer"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getDictionary } from "@/lib/dictionaries"
import Image from "next/image"

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <main className="min-h-screen p-4 md:p-24 max-w-4xl mx-auto">
      <div className="flex gap-3 flex-wrap justify-center sm:justify-between items-center mb-6">
        <LanguageSwitcher currentLang={lang} />
        <a href="https://www.buymeacoffee.com/luisao" target="_blank">
          <Image src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width={160} height={45} />
        </a>
      </div>

      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">{dict.title}</h1>
          <p className="text-xl text-muted-foreground mt-2">{dict.subtitle}</p>
          
          <div className="mt-6 flex justify-center">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-800">
              <img src="/images/linus.png" alt={dict.imageAlt} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        <PrAnalyzer dict={dict} lang={lang} />
      </div>
    </main>
  )
}
