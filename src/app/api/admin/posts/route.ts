import { NextResponse } from "next/server"
import { prisma } from "@/app/_libs/prisma"

export type PostsIndexResponse = {
  posts:{
    id: number
    title: string
    createdAt: Date
  }[]
}

export const GET = async (req: Request) => {
  const token = req.headers.get("x-admin-token")

  if (token !== process.env.ADMIN_TOKEN) {
    return new NextResponse("Unauthorized", { status:401 })
  }

  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true, 
        title: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!posts) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 })
    }

    return NextResponse.json<PostsIndexResponse>( { posts }, { status: 200 })

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
      return NextResponse.json({ message: "Unknown error" }, { status: 500 })
  }
} 


export type CreatePostBody = {
  title: string
  content: string
  thumbnailUrl: string
  categoryIds: {id: number}[]
}

export type CreatePostResponse = {
  id: number
}

export const POST = async (req: Request) => {

  // ① token確認
  const token = req.headers.get("x-admin-token")

  if (token !== process.env.ADMIN_TOKEN) {
    return new NextResponse("Unauthorized", { status:401 })
  }

  try {
    // ② body取得
    const body: CreatePostBody = await req.json()

    const { title, content, thumbnailUrl, categoryIds } = body

    // ③ バリデーション
    if (!title || !content) {
      return NextResponse.json({ message: "title and content are required "},{ status: 400 })
    }

    if (!Array.isArray(categoryIds)) {
      return NextResponse.json({ message: "categoryIds must be an array" },{ status: 400 })
    }

    // ④ prisma.post.create()
    const data = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailUrl,
        postCategories: {
          create: categoryIds.map((category) => ({
            category: {
              connect: { id: category.id }
            }
          }))
        }
      }
    })

    // ⑤ response返す
    return NextResponse.json<CreatePostResponse>({ id: data.id },{ status: 201 })

  } catch ( error ){
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message },{ status: 400 })
    }
    return NextResponse.json({ message: "Unknown error"}, { status: 500 })
  }
}