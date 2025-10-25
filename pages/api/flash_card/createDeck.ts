import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method is not allowed" });
  }

  try {
    const { name, color, learned, user_id } = req.body;

    console.log(name, color, learned, user_id);

    const query = `INSERT INTO decks (name, color, learned, user_id) VALUES ($1, $2, $3, $4)`;
    const values = [name, color, learned, user_id];

    await db.query(query, values);

    return res.status(200).json({ message: "Successfully creating deck" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error inserting decks" });
  }
}
