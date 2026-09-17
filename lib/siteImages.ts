import fs from "node:fs"
import path from "node:path"

const PUBLIC_DIR = path.join(process.cwd(), "public")
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"])

/** この接頭辞を付けたファイルは、フォルダ内で必ず最後に並ぶ */
const TRAILING_PREFIX = "z_"

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
      .sort((a, b) => {
        // `z_` で始まるファイルは常に最後に回す（外観写真などを末尾に置くため）。
        // 日本語のファイル名が混ざっても順序が崩れないよう、照合順序には任せない。
        const lastA = a.startsWith(TRAILING_PREFIX) ? 1 : 0
        const lastB = b.startsWith(TRAILING_PREFIX) ? 1 : 0
        if (lastA !== lastB) return lastA - lastB
        return a.localeCompare(b, "en", { numeric: true })
      })
      .map((file) => `/${folder}/${file}`)
  } catch {
    return []
  }
}

export type SizedImage = { src: string; width: number; height: number }

export type ImageFolder = {
  /** フォルダ名。物件の識別子として背景色の指定に使う */
  name: string
  images: SizedImage[]
}

/** サイズが読めなかった場合に使う既定値（一般的な3:2） */
const FALLBACK_SIZE = { width: 1500, height: 1000 }

/**
 * JPEG / PNG のヘッダーから画像サイズを読む。縦写真と横写真が混ざっても
 * 縦横比を保って並べられるよう、ビルド時に実寸を取っておく。
 */
function readImageSize(absolutePath: string): { width: number; height: number } {
  try {
    const buf = fs.readFileSync(absolutePath)

    if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
    }

    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2
      while (i + 9 < buf.length) {
        if (buf[i] !== 0xff) {
          i += 1
          continue
        }
        const marker = buf[i + 1]
        const isStartOfFrame =
          marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc
        if (isStartOfFrame) {
          return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) }
        }
        if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd9)) {
          i += 2
          continue
        }
        i += 2 + buf.readUInt16BE(i + 2)
      }
    }
  } catch {
    // 読めなければ既定値で表示する
  }
  return FALLBACK_SIZE
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
      .map((entry) => ({
        name: entry.name,
        images: listImages(`${folder}/${entry.name}`).map((src) => ({
          src,
          ...readImageSize(path.join(PUBLIC_DIR, src)),
        })),
      }))
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
