"use client";
import Breadcrumb from "@/app/components/Breadcrumb";
import React, { useEffect, useState } from "react";
import useDeckStore from "@/lib/deckStore";
import Link from "next/link";
import { CheckIcon, PenBoxIcon, Percent, Plus, XIcon } from "lucide-react";
import { showModal } from "@/lib/showModal";
import { Word, Deck, EditData } from "@/model/flashcard";
import Learn from "@/app/components/FlashCard/Learn";
import useUserStore from "@/lib/userStore";
import axios from "axios";
import { getDeckIdInPath } from "@/lib/pathFunctions";
import { usePathname } from "next/navigation";
import SearchWordInFlashCard from "@/app/components/FlashCard/SearchWordInFlashCard";

const DeckDetail = () => {
  const path = usePathname();
  const { currentDeck, setCurrentDeck } = useDeckStore();
  const { currentUser } = useUserStore();
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [newWord, setNewWord] = useState<{ front: string; back: string }>({
    front: "",
    back: "",
  });
  const [newlyAddedId, setNewlyAddedId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState<string>();

  const [words, setWords] = useState<Word[]>([]);

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<EditData>();
  const [currentEditWord, setCurrentEditWord] = useState<Word>();

  useEffect(() => {
    if (!path) {
      return;
    }
    try {
      const fetchDeckFromDb = async () => {
        await axios
          .get(`/api/flash_card/fetchDeckById?deck_id=${getDeckIdInPath(path)}`)
          .then((res) => {
            const deckInfo = res.data;
            setCurrentDeck({
              id: deckInfo.id,
              name: deckInfo.name,
              words: deckInfo.words,
              learned: deckInfo.learned ?? 0,
              completed_percentage: deckInfo.completed_percentage ?? 0,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      };
      fetchDeckFromDb();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const filteredWords = !searchValue
    ? words
    : words.filter((word) =>
        word.front.toLowerCase().includes(searchValue.toLowerCase())
      );

  useEffect(() => {
    if (currentDeck) {
      const sorted = [...currentDeck.words].sort((a, b) => b.id - a.id);
      setWords(sorted);
    }
  }, [currentDeck]);

  if (!currentDeck) {
    return (
      <div className="mx-auto max-w-5xl mt-10 px-4">
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            Error! We can't find your deck. Go back to{" "}
            <Link
              href={"/learn/flash-card"}
              className="underline text-cyan-300"
            >
              Flash Card
            </Link>
          </span>
        </div>
      </div>
    );
  }

  const handleRevealBack = (item: Word) => {
    if (editMode) {
      setCurrentEditWord(item);
      showModal("edit_word_dialog");
    } else {
      setFlippedCards((prev) => {
        const newSet = new Set(prev);

        if (newSet.has(item.id)) {
          newSet.delete(item.id);
        } else {
          newSet.add(item.id);
        }

        return newSet;
      });
    }
  };

  const handleAddWord = async () => {
    const newId =
      words.length > 0 ? Math.max(...words.map((w) => w.id)) + 1 : 1;

    const wordToAdd: Word = {
      id: newId,
      front: newWord.front.trim(),
      back: newWord.back.trim(),
      learnStatus: 0,
      easeFactor: 2.5,
      interval: 1,
      nextReview: null,
      repetitions: 0,
      lastReview: null,
    };
    const updatedWords = [...words, wordToAdd];
    if (!currentUser) {
      const deckList = JSON.parse(localStorage.getItem("deckList") || "[]");
      const updatedDeck = {
        ...deckList.find((item: Deck) => item.id === currentDeck.id),
        words: updatedWords,
      };

      const updatedAllDeck = deckList.map((item: Deck) =>
        item.id === updatedDeck.id ? updatedDeck : item
      );

      setNewlyAddedId(newId);
      localStorage.setItem("deckList", JSON.stringify(updatedAllDeck));
    } else {
      await axios
        .post(`/api/flash_card/addWordToDeck`, {
          front: newWord.front.trim(),
          back: newWord.back.trim(),
          deck_id: currentDeck.id,
        })
        .then((res) => {
          setNewlyAddedId(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setWords(updatedWords);
    setNewWord({ front: "", back: "" });
    setTimeout(() => setNewlyAddedId(null), 100);

    (document.getElementById("add_word_modal") as HTMLDialogElement)?.close();
  };

  const getPercentageTextColor = (percentage: number) => {
    if (percentage >= 0 && percentage < 40) {
      return "text-error";
    } else if (percentage >= 40 && percentage < 70) {
      return "text-warning";
    } else {
      return "text-success";
    }
  };

  return (
    <div className="max-w-5xl mx-auto pt-10 px-4">
      <Breadcrumb />

      {/* deck name & function */}
      <div className="flex items-center justify-between">
        {editMode ? (
          <input
            className="input input-xl font-semibold my-5"
            type="text"
            value={currentDeck.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          ></input>
        ) : (
          <h1 className="text-4xl my-5 font-semibold">{currentDeck.name}</h1>
        )}
        <div className="flex gap-5 items-center">
          <button
            className="hover:scale-105 cursor-pointer"
            onClick={() => setEditMode(true)}
          >
            {editMode ? (
              <CheckIcon className="text-green-400" />
            ) : (
              <PenBoxIcon />
            )}
          </button>

          {editMode && (
            <button
              className="hover:scale-105 cursor-pointer"
              onClick={() => setEditMode(false)}
            >
              <XIcon className="text-red-400" />
            </button>
          )}
        </div>
      </div>

      {/* stats */}
      <div className="stats shadow flex flex-wrap md:flex-nowrap w-full justify-between my-10">
        <div className="stat">
          <div className="stat-title">Words</div>
          <div className="stat-value text-primary">{words.length}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Complete Percentage</div>
          <div
            className={`stat-value flex items-center gap-2 ${getPercentageTextColor(
              currentDeck.completed_percentage
            )}`}
          >
            {currentDeck.completed_percentage}
            <span>
              <Percent />
            </span>
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Learned times</div>
          <div className="stat-value text-info">{currentDeck.learned}</div>
        </div>
      </div>

      {/* learn button */}
      <Learn />

      <SearchWordInFlashCard setSearchValue={setSearchValue} />

      {/* add word modal */}
      <dialog id="add_word_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-xl mb-5 border-b pb-5">Add new word</h3>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Front face</legend>
            <input
              type="text"
              className="input w-full"
              placeholder="Type here"
              value={newWord.front}
              onChange={(e) =>
                setNewWord({ ...newWord, front: e.target.value })
              }
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Back face</legend>
            <input
              type="text"
              className="input w-full"
              placeholder="Type here"
              value={newWord.back}
              onChange={(e) => setNewWord({ ...newWord, back: e.target.value })}
            />
          </fieldset>
          <div className="modal-action">
            <form method="dialog">
              {newWord.front && newWord.back && (
                <button
                  className="btn btn-primary"
                  disabled={!newWord.front || !newWord.back}
                  onClick={handleAddWord}
                >
                  Add word
                </button>
              )}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* words container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          className="card shadow-md bg-base-200 border-2 border-dashed border-primary text-primary cursor-pointer hover:bg-primary hover:text-white transition-all"
          onClick={() => showModal("add_word_modal")}
        >
          <div className="card-body p-4 flex items-center justify-center text-center">
            <h2 className="card-title text-lg flex items-center gap-2 whitespace-nowrap">
              <Plus className="w-5 h-5" />
              Add new word
            </h2>
          </div>
        </div>

        {filteredWords.map((item, index) => (
          <div
            key={index}
            className={`card shadow-md bg-base-300 cursor-pointer transition-all duration-500 ease-in-out tooltip ${
              flippedCards.has(item.id) && "bg-secondary text-secondary-content"
            } ${newlyAddedId === item.id ? "scale-125 bg-base-300" : ""}`}
            data-tip={editMode ? "Click to edit" : "Click to flip"}
            onClick={() => handleRevealBack(item)}
            style={{ height: "8rem" }}
          >
            <div className="card-body p-4 flex items-center justify-center text-center overflow-hidden">
              <h2 className="card-title break-words w-full line-clamp-3 select-none">
                {flippedCards.has(item.id) ? item.back : item.front}
              </h2>
            </div>
          </div>
        ))}
      </div>

      <dialog id="edit_word_dialog" className="modal">
        <div className="modal-box">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Front face</legend>
            <input
              type="text"
              className="input w-full"
              placeholder="Type here"
              value={currentEditWord?.front}
              onChange={(e) =>
                setCurrentEditWord({...currentEditWord, front: e.target.value})
              }
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Back face</legend>
            <input
              type="text"
              className="input w-full"
              placeholder="Type here"
              value={currentEditWord?.back}
              onChange={(e) => setNewWord({ ...newWord, back: e.target.value })}
            />
          </fieldset>
          <div className="modal-action">
            <form method="dialog">
              {newWord.front && newWord.back && (
                <button
                  className="btn btn-primary"
                  disabled={!newWord.front || !newWord.back}
                  onClick={handleAddWord}
                >
                  Add word
                </button>
              )}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default DeckDetail;
