import { auth, clerkClient } from "@clerk/nextjs/server";

type ClerkMetricsResponse = {
  dau: number;
  wau: number;
  mau: number;
  mrr: number;
};

const ADMIN_EMAIL = "mousab.r@gmail.com";

function toDate(daysAgo: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clerkClient();

    const user = await client.users.getUser(userId);
    const hasAdminEmail = Boolean(
      user.emailAddresses?.some((e) => e.emailAddress.toLowerCase() === ADMIN_EMAIL),
    );
    if (!hasAdminEmail) {
      return Response.json({ error: "Not Found" }, { status: 404 });
    }

    // Approximation using user creation windows until dedicated analytics endpoint is wired.
    const [dayUsers, weekUsers, monthUsers] = await Promise.all([
      client.users.getUserList({ createdAtAfter: toDate(1).getTime(), limit: 500 }),
      client.users.getUserList({ createdAtAfter: toDate(7).getTime(), limit: 500 }),
      client.users.getUserList({ createdAtAfter: toDate(30).getTime(), limit: 500 }),
    ]);

    const payload: ClerkMetricsResponse = {
      dau: dayUsers.data.length,
      wau: weekUsers.data.length,
      mau: monthUsers.data.length,
      // MRR requires Stripe/subscription source; keep 0 until billing backend is connected.
      mrr: 0,
    };

    return Response.json(payload);
  } catch (error) {
    console.error("Failed to fetch Clerk metrics:", error);
    return Response.json(
      {
        dau: 0,
        wau: 0,
        mau: 0,
        mrr: 0,
      } satisfies ClerkMetricsResponse,
      { status: 200 },
    );
  }
}
