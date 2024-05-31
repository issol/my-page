import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const getSearchParam = (url: URL, param: string): string =>
  url.searchParams.get(param) || ''

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (/_next\/static|images|locales/.test(path)) {
    // _next/static, images, locales 경로는 무시
    return NextResponse.next()
  }

  console.log(request.nextUrl.pathname, 'request')
  console.log(request.cookies)
  // return NextResponse.redirect(new URL('/kk', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/:path*'],
}
