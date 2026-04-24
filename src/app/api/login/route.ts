import { NextResponse } from "next/server";

const DEFAULT_PASSWORD_ERROR = "密码不正确，请重试。";
const MISSING_PASSWORD_ERROR = "请先配置 Pwd。";

export async function POST(request: Request) {
  const configuredPassword = process.env.Pwd;

  if (!configuredPassword) {
    return NextResponse.json(
      { authenticated: false, error: MISSING_PASSWORD_ERROR },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : null;

  if (password === null) {
    return NextResponse.json(
      { authenticated: false, error: "请求格式不正确。" },
      { status: 400 }
    );
  }

  if (password === configuredPassword) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json(
    { authenticated: false, error: DEFAULT_PASSWORD_ERROR },
    { status: 401 }
  );
}
