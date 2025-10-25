import React from "react";

const SearchWordInFlashCard = ({
  setSearchValue,
}: {
  setSearchValue: (value: string) => void;
}) => {
  return (
    <label className="input w-full mb-5">
      <svg
        className="h-[1em] opacity-50"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2.5"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </g>
      </svg>
      <input
        type="search"
        className="grow"
        placeholder="Search for word..."
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </label>
  );
};

export default SearchWordInFlashCard;
