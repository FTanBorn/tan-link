// src/app/api/cloudinary/route.ts
import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST(request: Request) {
  try {
    // URL'den action parametresini al
    const url = new URL(request.url)
    const action = url.searchParams.get('action')

    // Upload işlemi
    if (action === 'upload') {
      const formData = await request.formData()
      const file = formData.get('file') as Blob

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      }

      // Dosyayı Base64'e dönüştür
      const fileBuffer = await file.arrayBuffer()
      const fileBase64 = Buffer.from(fileBuffer).toString('base64')
      const fileUri = `data:${file.type};base64,${fileBase64}`

      // Cloudinary'ye yükle
      const result = await cloudinary.uploader.upload(fileUri, {
        folder: 'profiles'
      })

      return NextResponse.json({
        secure_url: result.secure_url,
        public_id: result.public_id
      })
    }

    // Delete işlemi
    else if (action === 'delete') {
      const { publicId } = await request.json()

      if (!publicId) {
        return NextResponse.json({ error: 'Public ID is required' }, { status: 400 })
      }

      // Cloudinary'den sil
      const result = await cloudinary.uploader.destroy(publicId)

      return NextResponse.json({ success: true, result })
    }

    // Geçersiz action
    else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in Cloudinary API route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
