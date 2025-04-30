import { PrAnalyzer } from "@/components/pr-analyzer"
import { LanguageSwitcher } from "@/components/language-switcher"
import { DonationButton } from "@/components/donation-button"
import { getDictionary } from "@/lib/dictionaries"
import Script from 'next/script'

export default async function Home({
  params: { lang },
}: {
  params: { lang: string }
}) {
  const dict = await getDictionary(lang)

  return (
    <main className="min-h-screen p-4 md:p-24 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <LanguageSwitcher currentLang={lang} />
        <Script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="luisao" data-color="#FFDD00" data-emoji=""  data-font="Cookie" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff" ></Script>
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
