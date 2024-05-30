import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const getSearchParam = (url: URL, param: string): string =>
  url.searchParams.get(param) || ''

export function middleware(request: NextRequest) {
  console.log(request.nextUrl, 'request')

  return NextResponse.redirect(new URL('/home', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/'],
}
