import { NextResponse } from 'next/server'
import { genSuccessData, genErrorData } from '@/app/api/utils/getResData'

export interface ConfigResponse {
  hocuspocusBaseUrl?: string
}
export async function GET() {
  try {
    return NextResponse.json(
      genSuccessData({
        hocuspocusBaseUrl:
          process.env.NEXT_PUBLIC_HOCUSPOCUS_BASE_URL || 'ws://localhost:1234',
      })
    )
  } catch (err: any) {
    return NextResponse.json(genErrorData(err.message))
  }
}
