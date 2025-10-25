"use client";
import { showModal } from "@/lib/showModal";
import React, { useEffect, useState, useRef } from "react";
import useDeckStore from "@/lib/deckStore";
import useUserStore from "@/lib/userStore";
import { LearnStatus, Word } from "@/model/flashcard";
import Confetti from "react-confetti";
import { Percent, X } from "lucide-react";
import { getNextReview } from "@/lib/sm2";
import axios from "axios";

const Learn = () => {
  const { currentDeck, setCurrentDeck } = useDeckStore();
  const { currentUser } = useUserStore();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isShowingBack, setIsShowingBack] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [learningQueue, setLearningQueue] = useState<number[]>([]);
  const [seenCount, setSeenCount] = useState(1);
  const [dueWords, setDueWords] = useState<Word[]>();
  const [practiceMode, setPracticeMode] = useState(false);
  const updatedWordIndices = useRef<Set<number>>(new Set());

  const grading: LearnStatus[] = [0, 1, 2, 3];

  const gradingMap = {
    0: "Forget",
    1: "Hard",
    2: "Good",
    3: "Easy",
  };

  const gradingColor = {
    0: "bg-error text-error-content",
    1: "bg-warning text-warning-content",
    2: "bg-success text-success-content",
    3: "bg-info text-info-content",
  };

  const setPointToWord = (
    point: LearnStatus,
    E: number,
    I: number,
    R: number
  ) => {
    if (!currentDeck || !currentDeck.words) return;

    console.log("Word update fired");

    if (point === 0 || point === 1) {
      setLearningQueue((prev) => [...prev, currentWordIndex]);
    }

    const { EF, interval, repetition } = getNextReview(point, E, I, R);

    const updatedWords = [...currentDeck?.words];
    if (!practiceMode) {
      updatedWords[currentWordIndex] = {
        ...updatedWords[currentWordIndex],
        learnStatus: point,
        easeFactor: EF,
        interval: interval,
        repetitions: repetition,
        lastReview: new Date(),
        nextReview: new Date(Date.now() + interval * 24 * 60 * 60 * 1000),
      };
    }

    setCurrentDeck({ ...currentDeck, words: updatedWords });
  };

  const getCompletionPercentage = () => {
    if (!currentDeck || !currentDeck.words || currentDeck.words.length === 0)
      return 0;

    const total = currentDeck.words.length;
    const sum = currentDeck.words.reduce(
      (acc, word) => acc + word.learnStatus,
      0
    );
    const percentage = Math.round((sum / (total * 3)) * 100);

    return percentage;
  };

  const getNextWordIndex = () => {
    if (!currentDeck) {
      return;
    }

    let newIndex: number | undefined;

    if (seenCount < currentDeck.words.length) {
      setSeenCount(seenCount + 1);
      newIndex = currentWordIndex + 1;
    } else if (learningQueue.length > 0) {
      const next = learningQueue[0];
      setLearningQueue((prev) => prev.slice(1));
      newIndex = next;
    } else {
      newIndex = currentDeck.words.length;
    }

    if (newIndex !== undefined) {
      setCurrentWordIndex(newIndex);
      return newIndex;
    }

    return -1;
  };

  const startPracticeMode = () => {
    setDueWords(currentDeck?.words.sort((a, b) => b.id - a.id));
    setPracticeMode(true);
  };

  useEffect(() => {
    setDueWords(
      currentDeck?.words
        .filter(
          (word) => !word.nextReview || new Date() >= new Date(word.nextReview)
        )
        .sort((a, b) => b.id - a.id)
    );
  }, []);

  //* Handle end learning
  useEffect(() => {
    if (
      currentWordIndex === currentDeck?.words.length &&
      learningQueue.length === 0
    ) {
      setIsFinish(true);

      if (practiceMode) {
        return;
      }

      try {
        const updateDeckStat = async () => {
          await axios.put(`/api/flash_card/updateDeckStats`, {
            deck_id: currentDeck.id,
            completed_percentage: getCompletionPercentage(),
            user_id: currentUser?.uid,
            words: currentDeck.words,
          });
        };

        updateDeckStat();
      } catch (error) {
        console.log(error);
      }
    }
  }, [currentWordIndex]);

  if (!currentDeck) {
    return null;
  }

  if (!dueWords) {
    return;
  }

  return (
    <div>
      {/* Learn buttons */}
      <div className="flex items-center justify-center gap-5">
        <button
          className={`btn mb-5 flex-grow bg-warning text-warning-content`}
          onClick={() => {
            showModal("open_learn_modal");
          }}
        >
          Learn Now
        </button>
      </div>

      {/* Learn whole deck dialog */}
      <dialog id="open_learn_modal" className="modal">
        <div className="modal-box max-w-5xl md:max-h-1/2 h-[80vh] w-[90vw] md:w-full flex flex-col gap-5 rounded-lg">
          {!isFinish ? (
            <>
              <div className="bg-base-200 py-2 relative">
                <h1 className="text-center rounded text-xl font-semibold">
                  {currentDeck.name}
                </h1>

                <div className="absolute top-1/2 -translate-y-1/2 right-0">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-ghost">
                      <X />
                    </button>
                  </form>
                </div>
              </div>

              <div className="bg-base-200 w-full h-full rounded">
                {dueWords.length > 0 ? (
                  dueWords.map(
                    (item, index) =>
                      currentWordIndex === index && (
                        <div
                          key={index}
                          className="h-full flex flex-col md:flex-row items-center justify-center gap-5"
                        >
                          <div className="w-full md:w-1/2 h-full flex items-center justify-center text-2xl font-semibold relative">
                            <h1
                              data-tip="Flip"
                              className={`tooltip cursor-pointer ${
                                isShowingBack && "text-secondary"
                              }`}
                              onClick={() => setIsShowingBack((prev) => !prev)}
                            >
                              {isShowingBack ? item.back : item.front}
                            </h1>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full md:w-1/2 px-5">
                            {grading.map((subItem, subIndex) => (
                              <button
                                key={subIndex}
                                className={`btn w-full h-16 lg:h-30 rounded-xl ${gradingColor[subItem]} hover:opacity-90 active:scale-95 transition`}
                                onClick={() => {
                                  getNextWordIndex();
                                  if (
                                    !updatedWordIndices.current.has(
                                      currentWordIndex
                                    )
                                  ) {
                                    updatedWordIndices.current.add(
                                      currentWordIndex
                                    );

                                    setPointToWord(
                                      subItem,
                                      item.easeFactor,
                                      item.interval,
                                      item.repetitions
                                    );
                                  }

                                  setIsShowingBack(false);
                                }}
                              >
                                {gradingMap[subItem]}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                  )
                ) : (
                  <div className="h-full flex flex-col justify-center items-center gap-10">
                    <h1 className="text-xl font-semibold">
                      No cards to review today 🎉
                    </h1>
                    <button
                      className="btn btn-secondary text-secondary-content"
                      onClick={startPracticeMode}
                    >
                      Learn anyway
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full overflow-hidden gap-5 relative">
              <Confetti numberOfPieces={200} recycle={false} />

              <h1 className="text-3xl font-bold text-success text-center">
                🎉 Deck completed
              </h1>
              <div className="my-10 flex flex-col items-center">
                <div className="stat-title">Complete Percentage</div>
                <div className="stat-value text-success flex items-center gap-2">
                  {getCompletionPercentage()}
                  <span>
                    <Percent />
                  </span>
                </div>
                <progress
                  className="progress progress-success w-80"
                  value={getCompletionPercentage()}
                  max={100}
                />
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setCurrentWordIndex(0);
                    setSeenCount(1);
                    setIsFinish(false);
                    updatedWordIndices.current.clear();
                  }}
                >
                  🔁 Restart
                </button>
                <form method="dialog">
                  <button
                    className="btn btn-outline"
                    onClick={() => window.location.reload()}
                  >
                    Close
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default Learn;
