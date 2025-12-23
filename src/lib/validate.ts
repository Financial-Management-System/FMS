import { NextResponse } from "next/server";
import type { ZodSchema } from "zod";

export async function validateBody<T>(req: Request, schema: ZodSchema<T>) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return {
        ok: false as const,
        res: NextResponse.json(
          { message: "Validation failed", errors: parsed.error.flatten() },
          { status: 422 }
        ),
      };
    }

    return { ok: true as const, data: parsed.data };
  } catch {
    return {
      ok: false as const,
      res: NextResponse.json({ message: "Invalid JSON" }, { status: 400 }),
    };
  }
}