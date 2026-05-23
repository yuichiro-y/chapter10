import { NextResponse } from "next/server"
import { prisma } from "@/app/_libs/prisma"
import { supabase } from "@/app/_libs/supabase"

export type CategoriesIndexResponse = {
  categories: {
    id: number
    name: string
    createdAt: string
  }[]
}

export const GET = async (req: Request) => {
  const token = req.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 401 })
  }
  
  try { 
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const responseCategories = categories.map((category) => ({
      ...category,
      createdAt: category.createdAt.toISOString(),
    }))

    return NextResponse.json<CategoriesIndexResponse>({ categories:responseCategories }, { status:200 })

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
      return NextResponse.json({ message: "Unknown error" }, { status: 500 })
  }
} 

export type CreateCategoryBody = {
  name: string
}

type CreateCategoryResponse = {
  id: number
}

export const POST = async ( req: Request ) => {
  const token = req.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 401 })
  }

  try {
    const body: CreateCategoryBody = await req.json()
    const { name } = body
    const trimmedName = name.trim()

    if (!trimmedName) {
      return NextResponse.json({ message: "name is required "},{ status: 400 })
    }

    const data = await prisma.category.create({
      data: { name: trimmedName }
    })

    return NextResponse.json<CreateCategoryResponse>({ id: data.id },{ status: 201 })

  } catch ( error ){
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message },{ status: 400 })
    }
    return NextResponse.json({ message: "Unknown error"}, { status: 500 })
  }
}