import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method is not allowed" });
  }

  try {
    const { deck_id, completed_percentage, user_id, words } = req.body;

    const deckQuery = `UPDATE decks SET learned = learned + 1, completed_percentage = $1 WHERE id = $2 AND user_id = $3`;
    const deckValues = [completed_percentage, deck_id, user_id];

    await db.query(deckQuery, deckValues);

    const wordUpdatePromises = words.map(
      (word: {
        id: string;
        learnStatus: string;
        easeFactor: number;
        interval: number;
        repetitions: number;
        lastReview: Date;
        nextReview: Date;
      }) => {
        const wordQuery = `UPDATE words SET learn_status = $1, ease_factor = $2, interval = $3, next_review = $4, repetitions = $5, last_reviewed = $6 WHERE id = $7`;
        const wordValues = [
          word.learnStatus,
          word.easeFactor,
          word.interval,
          word.nextReview,
          word.repetitions,
          word.lastReview,
          word.id,
        ];
        return db.query(wordQuery, wordValues);
      }
    );

    await Promise.all(wordUpdatePromises);

    return res.status(200).json({ message: "Deck updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error updating deck stats" });
  }
}
