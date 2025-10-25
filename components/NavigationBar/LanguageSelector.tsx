import React from "react";
import "flag-icons/css/flag-icons.min.css";
import { ChevronDown } from "lucide-react";

const LanguageSelector = () => {
  return (
    <div className="dropdown dropdown-center md:dropdown-bottom">
      <label tabIndex={0} className="btn btn-sm m-1 hidden md:flex">
        🌐 Language
      </label>

      <label tabIndex={0} className=" m-1 flex items-center md:hidden">
        🌐 <ChevronDown className="w-3 h-3"/>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40"
      >
        <li>
          <a>
            <span className="fi fi-vn mr-2"></span>Tiếng Việt
          </a>
        </li>
        <li>
          <a>
            <span className="fi fi-us mr-2"></span>English
          </a>
        </li>
        <li>
          <a>
            <span className="fi fi-jp mr-2"></span>日本語
          </a>
        </li>
      </ul>
    </div>
  );
};

export default LanguageSelector;
