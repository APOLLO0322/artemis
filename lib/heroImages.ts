import fs from "node:fs"
import path from "node:path"

const HERO_DIR = path.join(process.cwd(), "public", "hero")
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"])

/**
 * Lists the hero photos dropped into `public/hero`, sorted by filename.
 * Runs at build time — adding or removing a file is all it takes to change
 * the slideshow, no code edit needed. Returns an empty list when the folder
 * is missing so the page falls back to the placeholder.
 */
export function getHeroImages(): string[] {
  try {
    return fs
      .readdirSync(HERO_DIR)
      .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
      .map((file) => `/hero/${file}`)
  } catch {
    return []
  }
}
