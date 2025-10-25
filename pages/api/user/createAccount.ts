import db from "@/lib/db";
import bcrypt from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function createAccount(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method is not allowed" });
  }

  const { uid, username, email, avatarURL, password, join_date } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (uid, username, email, avatarURL, password, join_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [uid, username, email, avatarURL, hashedPassword, join_date];

    const result = await db.query(query, values);

    return res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error creating account" });
  }
}
