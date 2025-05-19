import { stock } from "@/db/schema";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const count = await db.$count(
    stock,
    eq(stock.userId, session?.user.id || "")
  );

  if (count === 0) {
    return <div>add</div>;
  }

  return <div>demo</div>;
}
