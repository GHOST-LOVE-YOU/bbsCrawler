// 每天北京时间早上八点 cron: 0 0 8 * * *
import { NextResponse } from "next/server";

import { cleanAllBindings } from "@/lib/bindings/server-utils";

export async function GET() {
  try {
    await cleanAllBindings();
    return NextResponse.json({ message: "Bindings cleaned successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
