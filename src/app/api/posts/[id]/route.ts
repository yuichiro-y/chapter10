import { NextResponse } from "next/server"
import { prisma } from "@/app/_libs/prisma"

export type PostShowResponse = {
  post:{
    id: number
    title: string
    content: string
    thumbnailUrl: string
    createdAt: Date
    updatedAt: Date
    postCategories:{
      category: {
        id: number
        name: string
      }
    }[]
  }
}

type Params = { params: { id: string }}

export const GET = async ( _req: Request, { params }:Params ) => {
  try {
    const id = Number(params.id)
    
    if (Number.isNaN(id)){
      return NextResponse.json({ message: "id must be a number"}, { status: 400} )
    }

    const post = await prisma.post.findUnique({
      where: { id },
        include: {
          postCategories:{
            include:{
              category:{
                select:{
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
    })

    if (!post) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 })
    }

    return NextResponse.json<PostShowResponse>({ post }, { status:200 })

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
      return NextResponse.json({ message: "Unknown error" }, { status: 500 })
  }
} 