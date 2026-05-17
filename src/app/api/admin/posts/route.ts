import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/_libs/prisma"
import { supabase } from "@/app/_libs/supabase"


export type PostsIndexResponse = {
  posts:{
    id: number
    title: string
    createdAt: string
  }[]
}

export const GET = async (request: NextRequest) => {
    const token = request.headers.get('Authorization') ?? ''
    const { error } = await supabase.auth.getUser(token)

    if (error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  
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

    const responsePosts = posts.map((post) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
    }))

    return NextResponse.json<PostsIndexResponse>( { posts:responsePosts }, { status: 200 })

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
  thumbnailImageKey: string
  categoryIds: number[]
}

export type CreatePostResponse = {
  id: number
}

export const POST = async (req: Request) => {
  try {
    const body: CreatePostBody = await req.json()
    console.log(body)
    const { title, content, thumbnailImageKey, categoryIds } = body

    if (!title || !content) {
      return NextResponse.json({ message: "title and content are required "},{ status: 400 })
    }

    if (!Array.isArray(categoryIds)) {
      return NextResponse.json({ message: "categoryIds must be an array" },{ status: 400 })
    }

    const data = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailImageKey,
        postCategories: {
          create: categoryIds.map((categoryId) => ({
            category: {
              connect: { id: categoryId },
            }
          }))
        }
      }
    })

    return NextResponse.json<CreatePostResponse>({ id: data.id },{ status: 201 })

  } catch ( error ){
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message },{ status: 400 })
    }
    return NextResponse.json({ message: "Unknown error"}, { status: 500 })
  }
}