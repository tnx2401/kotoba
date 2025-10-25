"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { convertToSlug } from "@/lib/pathFunctions";
import useDeckStore from "@/lib/deckStore";
import useUserStore from "@/lib/userStore";
import { Deck } from "@/model/flashcard";
import { CornerUpRight } from "lucide-react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const FlashCardDeck = () => {
  const { setCurrentDeck } = useDeckStore();
  const { currentUser } = useUserStore();
  const [deck, setDeck] = useState<Deck[]>([]);

  useEffect(() => {
    const deckList = JSON.parse(localStorage.getItem("deckList") || "[]");

    if (currentUser && deckList.length > 0) {
      const insertAll = async () => {
        try {
          await Promise.all(
            deckList.map((deck: Deck) =>
              axios.post(`/api/flash_card/insertLocalDecksToDb`, {
                deck,
                user_id: currentUser.uid,
              })
            )
          );

          localStorage.removeItem("deckList");
        } catch (error) {
          console.error("Failed to save decks to db: ", error);
        }
      };

      insertAll();
    } else {
      setDeck(deckList);
    }

    if (deckList.length === 0 && currentUser) {
      const getDecksAfterLogIn = async () => {
        await axios
          .get(`/api/flash_card/fetchDecks?user_id=${currentUser.uid}`)
          .then((res) => {
            setDeck(res.data);
          })
          .catch((error) => {
            console.log(error);
          });
      };

      getDecksAfterLogIn();
    }
  }, [currentUser]);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
        📚 Your Decks <span className="text-gray-500">({deck.length})</span>
      </h1>
      {deck.length > 0 && !currentUser && (
        <span className="text-sm italic font-normal flex items-center gap-1 text-gray-400 select-none">
          Look like you have not logged in. Login to save your deck permanently
          across devices!
        </span>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-5">
        {deck.sort().map((item) => (
          <div
            key={item.id}
            className={`relative border border-base-200 rounded-xl shadow-sm hover:shadow-md transition-all p-4 ${
              item.color
            } ${item.color !== "bg-base-200" && "text-white"}`}
          >
            <h2
              className="font-semibold text-xl truncate flex items-center gap-2"
              title={item.name}
            >
              <span className="truncate">{item.name}</span>
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="mt-1 text-sm">
                  Words count:{" "}
                  <span className="font-medium">{item.words.length}</span>
                </p>
                <p className="mt-1 text-sm">
                  Learned times:{" "}
                  <span className="font-medium">{item.learned}</span>
                </p>
              </div>
              <div className="w-12 h-12 flex-shrink-0">
                <CircularProgressbar
                  value={item.completed_percentage}
                  text={`${item.completed_percentage}%`}
                  styles={buildStyles({
                    textColor: "#16a34a",
                    pathColor: "#16a34a",
                    trailColor: "#e5e7eb",
                    textSize: "24px",
                    backgroundColor: "white",
                  })}
                  background={true}
                />
              </div>
            </div>
            <div className="mt-5 text-right">
              <Link
                href={`/learn/flash-card/${convertToSlug(item.name)}-${
                  item.id
                }`}
                className="text-sm btn btn-circle btn-sm hover:underline cursor-pointer"
                onClick={() =>
                  setCurrentDeck({
                    id: item.id,
                    name: item.name,
                    words: item.words,
                    learned: item.learned ?? 0,
                    completed_percentage: item.completed_percentage ?? 0,
                  })
                }
              >
                <CornerUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashCardDeck;
