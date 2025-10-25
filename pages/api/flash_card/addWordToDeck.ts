import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method is not allowed" });
  }

  const { front, back, deck_id } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO words (front_face, back_face, deck_id) VALUES ($1, $2, $3) RETURNING id",
      [front, back, deck_id]
    );

    return res.status(200).json(result.rows[0].id);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error adding word to deck" });
  }
}
