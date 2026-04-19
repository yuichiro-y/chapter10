import { NextResponse } from "next/server"
import { prisma } from "@/app/_libs/prisma"

type Params = { params: { id: string }}

export type CategoryShowResponse = {
  category:{
    id: number
    name: string
    createdAt: Date
    updatedAt: Date
  }
}

export const GET = async ( _req: Request, { params }: Params ) => {
  const token = _req.headers.get("x-admin-token")

  if (token !== process.env.ADMIN_TOKEN) {
    return new NextResponse("Unauthorized", { status:401 })
  }

  try {
    const id = Number(params.id)
    
    if (Number.isNaN(id)){
      return NextResponse.json({ message: "id must be a number"}, { status: 400})
    }

    const category = await prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!category) {
      return NextResponse.json({ message: "カテゴリーが見つかりません" }, { status: 404 })
    }

    return NextResponse.json<CategoryShowResponse>({ category }, { status:200 })

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
      return NextResponse.json({ message: "Unknown error" }, { status: 500 })
  }
} 

export type PutCategoryBody = {
  name: string
}

export type PutCategoryResponse = {
  id: number
}

export const PUT = async (req: Request, { params }: Params) => {
  const token = req.headers.get("x-admin-token")

  if (token !== process.env.ADMIN_TOKEN) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const id = Number(params.id)
    
    if (Number.isNaN(id)){
      return NextResponse.json({ message: "id must be a number"}, { status: 400})
    }

    const body: PutCategoryBody = await req.json()
    const trimmedName = body.name.trim()

    if (!trimmedName) {
      return NextResponse.json({ message: "name is required" }, { status: 400 })
    } 

    const data = await prisma.category.update({
      where: { id },
      data: { name: trimmedName },
    })

    return NextResponse.json<PutCategoryResponse>({ id: data.id },{ status: 200 })
  } catch ( error ){
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message },{ status: 400 })
    }
    return NextResponse.json({ message: "Unknown error"}, { status: 500 })
  }
}

export const DELETE = async ( req: Request, { params }: Params ) => {
  const token = req.headers.get("x-admin-token")

  if (token !== process.env.ADMIN_TOKEN) {
    return new NextResponse("Unauthrized", { status: 401 })
  }

  try {
    const id = Number(params.id)

    if (Number.isNaN(id)) {
      return NextResponse.json({ message: "ID is invalid" }, { status: 400})
    }

    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      return NextResponse.json({ message: 'カテゴリーが見つかりません' },{ status: 404 })
    }

    await prisma.$transaction([
      prisma.postCategory.deleteMany({
        where: { categoryId: id},
      }),
      prisma.category.delete({
        where: { id },
      }),
    ])

    return NextResponse.json({ message: "Category is deleted"}, { status: 200 })
  } catch (error){
    console.error(error)
    return NextResponse.json({ message: "Category deletion failed" },{ status: 500 })
  }
}