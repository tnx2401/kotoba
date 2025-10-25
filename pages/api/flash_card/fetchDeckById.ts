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
    const { deck_id } = req.query;

    if (!deck_id || isNaN(Number(deck_id))) {
      return res.status(400).json({ message: "Invalid or missing deck_id" });
    }

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
            'back', words.back_face,
            'learnStatus', words.learn_status,
            'easeFactor', words.ease_factor,
            'interval', words.interval,
            'nextReview', words.next_review,
            'repetitions', words.repetitions,
            'lastReviewed', words.last_reviewed
          )
        ) FILTER (WHERE words.id IS NOT NULL),
        '[]'::json
        ) AS words
        FROM decks
        LEFT JOIN words ON decks.id = words.deck_id
        WHERE decks.id = $1
        GROUP BY decks.id;
        `;

    const values = [deck_id];

    const result = await db.query(query, values);

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error fetching deck by id" });
  }
}
