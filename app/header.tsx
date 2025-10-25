import React from "react";
import ToggleDarkMode from "@/components/NavigationBar/ToggleDarkMode";
import Link from "next/link";
import Category from "@/components/NavigationBar/Category";
import LanguageSelector from "@/components/NavigationBar/LanguageSelector";
import LoginButton from "@/components/NavigationBar/LoginButton";

const Header = () => {
  return (
    <header className="navbar flex items-center justify-between p-3 xl:px-10 gap-1 select-none border-b border-base-200 shadow">
      <div className="flex items-center md:gap-5">
        <Link
          href={"/"}
          className="px-5 py-1 rounded-lg flex items-center justify-center"
        >
          <h1 className="text-center text-md md:text-xl">Kotob</h1>
          <span className="inline-block text-xl md:text-3xl rotate-10 text-red-400">
            あ
          </span>
        </Link>

        <Category />
      </div>

      <div className="flex items-center gap-5">
        <LanguageSelector />
        <ToggleDarkMode />
        <LoginButton />
      </div>
    </header>
  );
};

export default Header;
