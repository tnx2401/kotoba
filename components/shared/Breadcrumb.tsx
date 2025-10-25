"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import useDeckStore from "@/lib/deckStore";
import { useEffect } from "react";

const Breadcrumb = () => {
  const { currentDeck, setCurrentDeck } = useDeckStore();
  const pathname = usePathname();
  const segments = pathname?.split("/").filter(Boolean);
  const isDeckDetailPage =
    pathname?.startsWith("/learn/flash-card/") && segments?.length === 3;

  if (isDeckDetailPage && !currentDeck) {
    return null;
  }

  useEffect(() => {
    if (pathname === "/learn/flash-card") {
      setCurrentDeck(null);
    }
  }, [pathname]);

  const crumbs = segments?.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;

    let label = segment.replace(/-/g, " ");

    if (isLast && isDeckDetailPage && currentDeck) {
      label = currentDeck.name;
    }

    return {
      label,
      href,
      position: index + 2,
    };
  });

  return (
    <nav
      aria-label="breadcrumb"
      className="text-sm breadcrumbs"
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      <ul className="flex space-x-2 items-center">
        <li
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
        >
          <Link
            href="/"
            itemProp="item"
            className="hover:underline flex items-center gap-1"
          >
            <Home className="w-4 h-4" />
            <span itemProp="name">Home</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>

        {crumbs.map((crumb, i) => (
          <li
            key={crumb.href}
            className="flex items-center space-x-1"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <Link href={crumb.href} itemProp="item" className="hover:underline">
              <span itemProp="name" className="capitalize">
                {crumb.label.replace("-", " ")}
              </span>
            </Link>
            <meta itemProp="position" content={crumb.position.toString()} />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumb;
