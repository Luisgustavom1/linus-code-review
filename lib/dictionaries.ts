export interface Dictionary {
  title: string
  subtitle: string
  imageAlt: string
  form: {
    title: string
    warning: string
    placeholder: string
    submit: string
    analyzing: string
  }
  errors: {
    title: string
    emptyUrl: string
    failed: string
  }
  results: {
    title: string
  }
  donation: {
    button: string
  }
}

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  "pt-br": () => import("./dictionaries/pt-br.json").then((module) => module.default),
}

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  // Default to 'en' if the locale is not supported
  const dictionary = dictionaries[locale] || dictionaries.en
  return dictionary()
}
