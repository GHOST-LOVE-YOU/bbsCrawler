import prisma from "@lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { endpoint } = req.body;

  try {
    await prisma.subscription.delete({
      where: {
        endpoint,
      },
    });
    res.status(200).json({ message: "Unsubscribed successfully." });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    res.status(500).json({ error: "Failed to unsubscribe" });
  }
}
