import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method is not allowed" });
  }

  try {
    const { user_id } = req.query;

    console.log(user_id);

    const query = `
      SELECT 
        decks.id,
        decks.name,
        decks.user_id,
        decks.color,
        decks.learned,
        decks.completed_percentage,
        COALESCE(
        json_agg(
          json_build_object(
            'id', words.id,
            'front', words.front_face,
            'back', words.back_face
          )
        ) FILTER (WHERE words.id IS NOT NULL),
        '[]'::json
        ) AS words
        FROM decks
        LEFT JOIN words ON words.deck_id = decks.id
        WHERE decks.user_id = $1
        GROUP BY decks.id, decks.name, decks.user_id;
        `;
    const values = [user_id];

    const result = await db.query(query, values);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error fecthing decks" });
  }
}
