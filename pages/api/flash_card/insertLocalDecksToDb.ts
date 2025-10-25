import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method is not allowed" });
  }

  try {
    const { name, color, words, learned } = req.body.deck;
    const { user_id } = req.body;

    const query =
      "INSERT INTO decks (name, color, learned, user_id) VALUES ($1, $2, $3, $4) RETURNING id";
    const values = [name, color, learned, user_id];

    const result = await db.query(query, values);

    const deckId = result.rows[0].id;

    if (words.length > 0) {
      for (const word of words) {
        const insertWordsQuery =
          "INSERT INTO words (front_face, back_face, deck_id) VALUES ($1,$2,$3)";
        const insertWordsValues = [word.front, word.back, deckId];

        await db.query(insertWordsQuery, insertWordsValues);
      }
    }

    return res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error inserting decks" });
  }
}
