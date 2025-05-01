import { NextRequest, NextResponse } from "next/server";
import { analyzePr } from "@/_api/analyze-pr";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  try {
    const { prUrl } = await req.json()
    const lang = (await params).lang
    
    const result = await analyzePr(prUrl, lang)

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
