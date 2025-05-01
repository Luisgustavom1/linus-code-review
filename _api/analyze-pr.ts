import { generateText } from "ai"
import { google } from "@ai-sdk/google"

function extractPrInfo(prUrl: string) {
  const regex = /github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/
  const match = prUrl.match(regex)

  if (!match) {
    throw new Error("Invalid GitHub PR URL format")
  }

  return {
    owner: match[1],
    repo: match[2],
    prNumber: Number.parseInt(match[3], 10),
  }
}

async function fetchPrData(owner: string, repo: string, prNumber: number) {
  // Fetch PR details
  const prResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`)

  if (!prResponse.ok) {
    throw new Error(`Failed to fetch PR: ${prResponse.statusText}`)
  }

  const prData = await prResponse.json()

  // Fetch PR files (diffs)
  const filesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`)

  if (!filesResponse.ok) {
    throw new Error(`Failed to fetch PR files: ${filesResponse.statusText}`)
  }

  const filesData = await filesResponse.json()

  return {
    title: prData.title,
    description: prData.body || "",
    files: filesData,
  }
}

export async function analyzePr(prUrl: string, lang: string): Promise<string> {
  try {
    const { owner, repo, prNumber } = extractPrInfo(prUrl)
    const prData = await fetchPrData(owner, repo, prNumber)

    // Prepare data for AI analysis
    const fileChanges = prData.files.map((file: any) => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      patch: file.patch || "No diff available",
    }))

    // Limit the input size to avoid token limits
    const maxFilesToAnalyze = 5
    const truncatedFiles = fileChanges.slice(0, maxFilesToAnalyze)

    // Generate prompt for AI
    const prompt = `
Analyze the following GitHub Pull Request:

Title: ${prData.title}
Description: ${prData.description}

File Changes (${Math.min(fileChanges.length, maxFilesToAnalyze)} of ${fileChanges.length} files shown):
${truncatedFiles
  .map(
    (file: any) => `
File: ${file.filename}
Status: ${file.status}
Changes: +${file.additions} -${file.deletions}
Diff:
${file.patch ? file.patch.substring(0, 1000) + (file.patch.length > 1000 ? "... (truncated)" : "") : "No diff available"}
`,
  )
  .join("\n")}

Please provide a brutally honest review of this PR in the style of Linus Torvalds. Respond in ${lang === "pt-br" ? "Brazilian Portuguese" : "English"}.
`

    const { text } = await generateText({
      model: google("gemini-1.5-pro"),
      system: `You are Linus Torvalds reviewing code. Be brutally honest, direct, and don't hold back. Use colorful language (but avoid actual profanity) and strong opinions. Point out stupid mistakes and bad design decisions with your characteristic bluntness. If you see good code, acknowledge it briefly, but focus on what could be improved. Your tone should be harsh but technically accurate. Make references to kernel development principles even when reviewing non-kernel code. Respond in ${lang === "pt-br" ? "Brazilian Portuguese" : "English"}.`,
      prompt,
    })

    return text
  } catch (error) {
    console.error("Error analyzing PR:", error)
    throw error
  }
}
