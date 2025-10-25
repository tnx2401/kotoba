export function convertToSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD") // Normalize accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9 -]/g, "") // Remove invalid chars
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/-+/g, "-") // Collapse multiple -
    .replace(/^-+|-+$/g, ""); // Trim - from start and end
}

export function getDeckIdInPath(pathname: string): string | null {
  const segments = pathname?.split("/").filter(Boolean);

  if (segments) {
    const deckpath = segments[segments.length - 1];
    const splited = deckpath.split("-");
    return splited[splited.length - 1];
  } else {
    return null;
  }
}
