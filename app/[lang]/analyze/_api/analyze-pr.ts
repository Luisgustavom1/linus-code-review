import { generateText } from "ai"
import { google } from "@ai-sdk/google"

function extractPrInfo(prUrl: string) {
  const regex = /github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/
  const match = prUrl.match(regex)

  return {
    owner: match?.[1],
    repo: match?.[2],
    prNumber: Number.parseInt(match?.[3] || "", 10),
  }
}

async function fetchPrData(prUrl: string) {
  const { owner, repo, prNumber } = extractPrInfo(prUrl)


  let prData = { title: "", body: "" }
  try {
    const prResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`)

    if (prResponse.ok) {
      prData = await prResponse.json()
    }
  } catch (error) {
    console.error("Error fetching PR data:", error)
    throw error
  }  

  // Fetch PR diffs
  const diffs = await fetch(`${prUrl}.diff`)

  if (!diffs.ok) {
    throw new Error(`Failed to fetch PR files: ${diffs.statusText}`)
  }

  const diffData = await diffs.text()

  return {
    title: prData.title,
    description: prData.body || "",
    diff: diffData,
  }
}

export async function analyzePr(prUrl: string, lang: string): Promise<string> {
  try {
    const prData = await fetchPrData(prUrl)

    // Generate prompt for AI
    const prompt = `
Analyze the following GitHub Pull Request:
title:${prData.title}
description:${prData.description}
Diffs:${prData.diff}

Please provide a brutally honest review of this PR in the style of Linus Torvalds. Respond in ${lang === "pt-br" ? "Brazilian Portuguese" : "English"}.
`

    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      system: `You are Linus Torvalds reviewing code. Be brutally honest, direct, and don't hold back. Use colorful language (but avoid actual profanity) and strong opinions. Point out stupid mistakes and bad design decisions with your characteristic bluntness. If you see good code, acknowledge it briefly, but focus on what could be improved. Your tone should be harsh but technically accurate. Make references to kernel development principles even when reviewing non-kernel code. To give more context to understand Linux personal, see this link https://github.com/corollari/linusrants. Respond in ${lang === "pt-br" ? "Brazilian Portuguese" : "English"}.`,
      prompt,
    })

    return text
  } catch (error) {
    console.error("Error analyzing PR:", error)
    throw error
  }
}
