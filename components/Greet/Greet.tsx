import React from "react";
import HeroAnimation from "./HeroAnimation";
import Link from "next/link";

const Greet = () => {
  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center min-h-dvh">
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-12">
        <div className="w-full md:w-2/3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-balance uppercase">
            Level up your language learning process
          </h1>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center gap-2 mt-3 text-balance uppercase">
            With
            <span className="inline-flex items-center gap-1 select-none">
              <span className="text-primary text-xl sm:text-2xl md:text-3xl normal-case">Kotob</span>
              <span className="text-2xl rotate-12 text-red-400">あ</span>
            </span>
          </h2>

          <p className="mt-4 text-gray-500 text-sm sm:text-base max-w-md">
            Functional, easy to use. Your best language pal!
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <button className="btn btn-primary md:btn-wide">
              Let’s get started!
            </button>
            <p className="text-sm sm:text-base text-gray-600">
              Already have an account?{" "}
              <Link href="/" className="text-blue-800 underline">
                Login
              </Link>{" "}
              to keep track of your progress.
            </p>
          </div>
        </div>

        <div className="w-full flex-1">
          <div className="bg-base-200 p-4 sm:p-6 rounded-lg shadow-md h-[250px] flex items-center justify-center">
            <div>
              <HeroAnimation />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Greet;
