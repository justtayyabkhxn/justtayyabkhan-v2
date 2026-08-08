import { readdir } from 'fs/promises'
import path from 'path'
import sharp from 'sharp'
import dynamic from 'next/dynamic'

export type GalleryImage = { url: string; width: number; height: number }

const GalleryCanvas = dynamic(() => import('./GalleryCanvas'), { ssr: false })

export default async function GalleryPage() {
  let images: GalleryImage[] = []

  try {
    const imgsDir = path.join(process.cwd(), 'public', 'imgs')
    const files = await readdir(imgsDir)
    const filtered = files
      .filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
      .sort((a, b) => {
        const numA = parseInt(a)
        const numB = parseInt(b)
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB
        return a.localeCompare(b)
      })

    images = await Promise.all(
      filtered.map(async (f) => {
        try {
          const meta = await sharp(path.join(imgsDir, f)).metadata()
          return { url: `/imgs/${f}`, width: meta.width ?? 0, height: meta.height ?? 0 }
        } catch {
          return { url: `/imgs/${f}`, width: 0, height: 0 }
        }
      })
    )
  } catch {
    // imgs directory not found
  }

  return <GalleryCanvas images={images} />
}
