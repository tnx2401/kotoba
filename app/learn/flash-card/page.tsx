import FlashCardDeck from "@/app/components/FlashCard/FlashCardDeck";
import React from "react";
import { CircleQuestionMark } from "lucide-react";
import Breadcrumb from "@/app/components/Breadcrumb";
import CreateDeck from "@/app/components/FlashCard/CreateDeck";

const FlashCard = () => {
  return (
    <div className="max-w-5xl mx-auto pt-10 px-4">
      <Breadcrumb />
      <h1 className="text-4xl font-semibold mt-5">Flash Card</h1>
      <p className="text-md text-gray-500 mt-2">
        Learn vocabulary faster through flash cards
      </p>
      <p className="text-sm italic flex items-center gap-1 text-gray-400 select-none">
        <CircleQuestionMark className="w-3 h-3" />
        Start by creating your own deck
      </p>

      <CreateDeck />
      <FlashCardDeck />
    </div>
  );
};

export default FlashCard;
