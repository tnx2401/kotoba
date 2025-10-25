"use client";
import { showModal } from "@/lib/showModal";
import { Check } from "lucide-react";
import React, { useState } from "react";
import { Deck } from "@/model/flashcard";
import useUserStore from "@/lib/userStore";
import axios from "axios";

const CreateDeck = () => {
  const { currentUser } = useUserStore();

  const [deckInfomartion, setDeckInformation] = useState({
    name: "",
    color: "bg-base-200",
    words: [],
    learned: 0,
  });

  const handleCreateDeck = async () => {
    if (!currentUser) {
      const newDeck = deckInfomartion;

      const existingDecks = JSON.parse(
        localStorage.getItem("deckList") || "[]"
      );

      const newId =
        existingDecks.length === 0
          ? 0
          : Math.max(...existingDecks.map((deck: Deck) => deck.id)) + 1;

      const updatedDeck = [
        ...existingDecks,
        { id: newId, ...newDeck, anonymousCreate: true },
      ];

      localStorage.setItem("deckList", JSON.stringify(updatedDeck));
    } else {
      await axios.post(`/api/flash_card/createDeck`, {
        ...deckInfomartion,
        user_id: currentUser.uid,
      });
    }

    setDeckInformation({ name: "", color: "", words: [], learned: 0 });
    alert("Create deck successfully");

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div>
      <button
        className="btn my-10 bg-base-300"
        onClick={() => showModal("create_deck_modal")}
      >
        Create deck
      </button>
      <dialog id="create_deck_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Create a new deck</h3>
          <fieldset className="fieldset my-5">
            <legend className="fieldset-legend">Deck's name</legend>
            <input
              type="text"
              className="input w-full"
              placeholder="Type here"
              value={deckInfomartion.name}
              onChange={(e) =>
                setDeckInformation({
                  ...deckInfomartion,
                  name: e.target.value,
                })
              }
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Color</legend>
            <div className="flex flex-wrap gap-2">
              {[
                "bg-accent",
                "bg-info",
                "bg-warning",
                "bg-error",
                "bg-base-200",
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div
                    className={`p-5 btn ${item} ${
                      deckInfomartion.color === item && "scale-110"
                    }`}
                    onClick={() =>
                      setDeckInformation({ ...deckInfomartion, color: item })
                    }
                  ></div>

                  {deckInfomartion.color === item && (
                    <span className="absolute top-0 right-0 text-green-300">
                      <Check />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </fieldset>
          <div className="modal-action">
            <form method="dialog">
              {deckInfomartion.name.length > 3 && (
                <button
                  className="btn mr-2 btn-primary"
                  onClick={handleCreateDeck}
                >
                  Create
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

export default CreateDeck;
