import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const regex = /\/\[companyName\]\//g

  const path = request.nextUrl.pathname.replace(regex, '/')

  const companyName = request.cookies.get('companyName')?.value ?? ''
  const companyNameRegex = new RegExp(`/${companyName}`, 'g')
  // console.log(path.includes(companyName), path, companyName)

  const url = new URL(request.url)
  const domain = url.origin

  const newUrl = new URL(
    `/${companyName}${path.split('/')[1] === companyName ? '' : path}`,
    domain,
  )

  if (
    /_next\/static|images|locales/.test(path) ||
    path === '/login/' ||
    path === `/${companyName}/login/` ||
    path.includes(companyName) ||
    request.url === newUrl.toString()
  ) {
    // _next/static, images, locales 경로는 무시
    return NextResponse.next()
  }

  return NextResponse.redirect(
    new URL(`/${companyName}${path.replace(companyNameRegex, '')}`, domain),
  )

  // if (path.includes(companyName)) {
  //   return NextResponse.redirect(new URL(`/${path}`, domain))
  // }

  // console.log(request.nextUrl.pathname, 'request')
  // console.log(request.cookies)

  // console.log(new URL(`/${companyName}/${path}`, request.url), 'new URL')
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/:path*'],
}
