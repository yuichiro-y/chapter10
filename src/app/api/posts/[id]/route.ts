import { NextResponse } from "next/server"
import { prisma } from "@/app/_libs/prisma"

type Params = { params: { id: string }}
export type PostShowResponse = {
  post:{
    id: number
    title: string
    content: string
    thumbnailImageKey: string
    createdAt: string
    postCategories:{
      category: {
        id: number
        name: string
      }
    }[]
  }
}

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

    const responsePost = {
      ...post,
      createdAt: post.createdAt.toISOString()
    }

    return NextResponse.json<PostShowResponse>({ post: responsePost }, { status:200 })

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
      return NextResponse.json({ message: "Unknown error" }, { status: 500 })
  }
} 