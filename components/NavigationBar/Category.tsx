"use client";
import React, { useEffect, useState } from "react";
import { AlignJustify, ChevronDown } from "lucide-react";
import Link from "next/link";
import { convertToSlug } from "@/lib/pathFunctions";
import { usePathname } from "next/navigation";

type TabType = "" | "Learn" | "Test" | "Quiz" | "Community";
const tabs: TabType[] = ["Learn", "Test", "Quiz", "Community"];

const learnSections: string[] = [
  "Flash Card",
  "Vocabulary",
  "Courses",
  "Grammar",
  "Listening",
  "Reading",
  "Pronunciation",
  "Daily Challenge",
];

const Category: React.FC = () => {
  const path = usePathname();
  const [activeTab, setActiveTab] = useState<TabType>("");
  const [isDropdown, setIsDropdown] = useState();

  useEffect(() => {
    if (path === "/") {
      setActiveTab("");
      return;
    }

    for (let type of tabs) {
      if (path?.toLowerCase().includes(type.toLowerCase())) {
        setActiveTab(type);
        break;
      }
    }
  }, [path]);

  return (
    <>
      <div className="md:hidden">
        <div className="dropdown dropdown-center md:dropdown-start">
          <div tabIndex={0} role="button" className="btn btn-xs md:btn-md">
            <AlignJustify className="w-3 h-3 md:w-5 md:h-5" />
          </div>
          <ul className="dropdown-content menu bg-base-200 rounded-box w-56">
            {tabs.map((item, index) =>
              item === "Learn" ? (
                <li key={index}>
                  <details open>
                    <summary>{item}</summary>
                    <ul>
                      {learnSections.map((section, i) => (
                        <li key={i}>
                          <Link
                            href={`/${convertToSlug(item)}/${convertToSlug(
                              section
                            )}`}
                          >
                            {section}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ) : (
                <li key={index}>
                  <Link href={`/${convertToSlug(item)}`}>{item}</Link>
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      <div role="tablist" className="tabs hidden md:block">
        {tabs.map((item, index) =>
          item === "Learn" ? (
            <div className="dropdown dropdown-hover" key={index}>
              <div
                tabIndex={0}
                className={`tab ${
                  activeTab === item ? "tab-active" : ""
                } flex items-center justify-center gap-2`}
                onClick={() => setActiveTab(item)}
              >
                {item}
                <span>
                  <ChevronDown className="w-3 h-3" />
                </span>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-60"
              >
                {learnSections.map((section, i) => (
                  <li key={i}>
                    <Link
                      href={`/${convertToSlug(item)}/${convertToSlug(section)}`}
                      onClick={(e) => {
                        const parent = (e.target as HTMLElement).closest(
                          ".dropdown"
                        );
                        if (parent instanceof HTMLElement) {
                          parent.blur();
                        }
                      }}
                    >
                      {section}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <Link
              href={`/${convertToSlug(item)}`}
              role="tab"
              className={`tab ${activeTab === item ? "tab-active" : ""}`}
              key={index}
              onClick={() => setActiveTab(item)}
            >
              {item}
            </Link>
          )
        )}
      </div>
    </>
  );
};

export default Category;
