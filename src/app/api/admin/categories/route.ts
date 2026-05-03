import { NextResponse } from "next/server"
import { prisma } from "@/app/_libs/prisma"

export type CategoriesIndexResponse = {
  categories: {
    id: number
    name: string
    createdAt: Date
  }[]
}

export const GET = async ( req: Request ) => {
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

    return NextResponse.json<CategoriesIndexResponse>({ categories }, { status:200 })

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
    console.log(data)
    return NextResponse.json<CreateCategoryResponse>({ id: data.id },{ status: 201 })

  } catch ( error ){
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message },{ status: 400 })
    }
    return NextResponse.json({ message: "Unknown error"}, { status: 500 })
  }
}