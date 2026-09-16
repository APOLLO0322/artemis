import fs from "node:fs"
import path from "node:path"

const PUBLIC_DIR = path.join(process.cwd(), "public")
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"])

/**
 * Lists the images dropped into a folder under `public/`, sorted by filename.
 * Runs at build time — adding or removing a file changes the page, no code
 * edit needed. Returns an empty list when the folder is missing, so pages
 * fall back to their placeholders.
 */
export function listImages(folder: string): string[] {
  try {
    return fs
      .readdirSync(path.join(PUBLIC_DIR, folder))
      .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
      .map((file) => `/${folder}/${file}`)
  } catch {
    return []
  }
}

export type ImageFolder = {
  /** フォルダ名。物件の識別子として背景色の指定に使う */
  name: string
  images: string[]
}

/**
 * `public/<folder>` の直下にあるサブフォルダを、それぞれの画像付きで返す。
 * 物件ごとにフォルダを分けて置くと、そのままブロックの並びになる。
 */
export function listImageFolders(folder: string): ImageFolder[] {
  try {
    return fs
      .readdirSync(path.join(PUBLIC_DIR, folder), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => ({ name: entry.name, images: listImages(`${folder}/${entry.name}`) }))
      .filter((group) => group.images.length > 0)
      .sort((a, b) => a.name.localeCompare(b.name, "en", { numeric: true }))
  } catch {
    return []
  }
}

/** First image in a folder under `public/`, for slots that hold a single photo. */
export function firstImage(folder: string): string | undefined {
  return listImages(folder)[0]
}

/** Path to one specific file under `public/`, or undefined until it is added. */
export function imageIfExists(relativePath: string): string | undefined {
  return fs.existsSync(path.join(PUBLIC_DIR, relativePath)) ? `/${relativePath}` : undefined
}
