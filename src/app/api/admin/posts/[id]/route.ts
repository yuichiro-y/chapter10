import { NextResponse } from "next/server"
import { prisma } from "@/app/_libs/prisma"
import { supabase } from "@/app/_libs/supabase"

export type PostShowResponse = {
  post:{
    id: number
    title: string
    content: string
    thumbnailImageKey: string
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

export const GET = async ( req: Request, { params }: Params ) => {
  const token = req.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 401 })
  }

  try {
    const id = Number(params.id)
    
    if (Number.isNaN(id)){
      return NextResponse.json({ message: "id must be a number"}, { status: 400})
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


type PutPostRequest = {
  title: string
  content: string
  thumbnailImageKey?: string
  categoryIds: number[]
}

export const PUT = async ( req: Request, { params }: Params) => {
  const token = req.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 401 })
  }

  try {
    const body: PutPostRequest = await req.json()
    const { title, content, thumbnailImageKey, categoryIds } = body

    if (!title || !content) {
      return NextResponse.json(
        { message: 'title and content are required' },{ status: 400 }
      )
    }

    const post = await prisma.post.update({
      where: {
        id: Number( params.id )
      },
      data: {
        title, 
        content, 
        thumbnailImageKey,
        postCategories: {
          deleteMany: {},
          create: categoryIds.map((categoryIds: number) => ({
            category: {
              connect: { id: categoryIds },
            },
          })),
        },
      },
    })

    return NextResponse.json(post, { status: 200 })

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { Message: error.message }, 
        { status: 400})
    }

    return NextResponse.json(
      { message: "Unkown error" },
      { status: 500 }
    )
  }
}


export const DELETE = async( req: Request, { params }: Params) => {
  const token = req.headers.get('Authorization') ?? ''
  const { error } = await supabase.auth.getUser(token)

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 401 })
  }

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(params.id),
      },
    })

    if (!post) {
      return NextResponse.json(
        { message: '記事が見つかりません' },
        { status: 404 }
      )
    }

    await prisma.post.delete({
      where: {
        id: Number(params.id),
      },
    })

    return NextResponse.json({ message: '記事を削除しました'})
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: '記事の削除に失敗しました'},
      { status: 500 }
    )
  }
}