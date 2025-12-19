import { NextResponse } from 'next/server'
import { loadCategories } from '@/lib/notes'

export async function GET() {
  const categories = loadCategories()
  return NextResponse.json({ code: 0, data: categories })
}
