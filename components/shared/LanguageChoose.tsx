import React from "react";

type Language = {
  name: string;
  native: string;
  flag: string;
};

const languages: Language[] = [
  { name: "Japanese", native: "勉強しましょう！", flag: "jp" },
  { name: "Korean", native: "공부합시다!", flag: "kr" },
  { name: "English", native: "Let's study!", flag: "gb" },
  { name: "Chinese", native: "我们学习吧！", flag: "cn" },
  { name: "German", native: "Lass uns lernen!", flag: "de" },
  { name: "French", native: "Étudions!", flag: "fr" },
  { name: "Italian", native: "Studiamo!", flag: "it" },
  { name: "Russian", native: "Давайте учиться!", flag: "ru" },
  { name: "Spanish", native: "¡Vamos a estudiar!", flag: "es" },
  { name: "Hindi", native: "चलिए पढ़ाई करें!", flag: "in" },
  { name: "Arabic", native: "هيا ندرس!", flag: "sa" },
  { name: "Portuguese", native: "Vamos estudar!", flag: "pt" },
  { name: "Bengali", native: "চলো পড়া করি!", flag: "bd" },
  { name: "Urdu", native: "آئیے پڑھتے ہیں!", flag: "pk" },
  { name: "Turkish", native: "Haydi çalışalım!", flag: "tr" },
  { name: "Vietnamese", native: "Cùng học nào!", flag: "vn" },
  { name: "Persian", native: "بیایید درس بخوانیم!", flag: "ir" },
  { name: "Indonesian", native: "Ayo belajar!", flag: "id" },
  { name: "Thai", native: "มาเรียนกันเถอะ!", flag: "th" },
  { name: "Malay", native: "Mari belajar!", flag: "my" },
];
const LanguageChoose = () => {
  return (
    <div className="bg-base-200">
      <div className="max-w-5xl mx-auto py-10">
        <h1 className="text-2xl font-semibold uppercase text-center">
          Which languages do you want to learn?
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10 px-4">
          {languages.slice(0, 9).map((lang) => (
            <div
              key={lang.flag}
              className="card card- bg-base-100 shadow-sm cursor-pointer hover:scale-105 hover:shadow-lg transition"
            >
              <figure className="pt-10">
                <span
                  className={`fi fi-${lang.flag} text-5xl rounded-xl border border-base-300`}
                ></span>
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">{lang.name}</h2>
                <div className="card-actions mt-5">
                  <button className="btn btn-primary btn-xs md:btn-sm w-full whitespace-nowrap text-sm">
                    {lang.native}
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="card bg-base-300 shadow-sm cursor-pointer hover:scale-105 hover:shadow-lg transition">
            <div className="card-body flex items-center justify-center">
              <h2 className="card-title">+{languages.length-9} more</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageChoose;
