const BAD_WORDS = [
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "bastard",
  "bc",
  "mc",
  "chutiya",
  "madarchod",
  "bhenchod",
  "gaand",
  "lund",
];

export function checkProfanity(text: string): boolean {
  if (!text) return false;

  const normalized = text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ""); // remove spaces too

  return BAD_WORDS.some(word =>
    normalized.includes(word)
  );
}