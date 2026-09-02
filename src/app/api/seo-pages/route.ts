import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "seo-exams.json");
    if (!fs.existsSync(filePath)) return NextResponse.json([]);
    return NextResponse.json(JSON.parse(fs.readFileSync(filePath, "utf8")));
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
