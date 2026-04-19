import { NextResponse } from "next/server"
import { prisma } from "@/app/_libs/prisma"

export type CategoryIndexResponse = {
  categories: {
    id: number
    name: string
    createdAt: Date
  }[]
}

export const GET = async ( req: Request ) => {
  const token = req.headers.get("x-admin-token")

  if (token !== process.env.ADMIN_TOKEN) {
    return new NextResponse("Unauthorized", { status:401 })
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

    return NextResponse.json<CategoryIndexResponse>({ categories }, { status:200 })

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
  const token = req.headers.get("x-admin-token")

  if (token !== process.env.ADMIN_TOKEN) {
    return new NextResponse("Unauthorized", { status:401 })
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
    console.log(data)
    return NextResponse.json<CreateCategoryResponse>({ id: data.id },{ status: 201 })

  } catch ( error ){
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message },{ status: 400 })
    }
    return NextResponse.json({ message: "Unknown error"}, { status: 500 })
  }
}