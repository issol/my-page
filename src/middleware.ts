import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const regex = /\/\[companyName\]\//g

  const path = request.nextUrl.pathname.replace(regex, '/')

  const companyName = request.cookies.get('companyName')?.value ?? ''

  console.log(path)

  const companyNameRegex = new RegExp(`/${companyName}`, 'g')
  // console.log(path.includes(companyName), path, companyName)

  const url = new URL(request.url)
  const domain = url.origin

  const newUrl = new URL(
    `/${companyName}${path.split('/')[1] === companyName ? '' : path}`,
    domain,
  )

  if (
    path === '/login/' ||
    path === `/${companyName}/login/` ||
    path.includes(companyName) ||
    request.url === newUrl.toString()
  ) {
    return NextResponse.next()
  }

  const response = NextResponse.redirect(
    new URL(`/${companyName}${path.replace(companyNameRegex, '')}`, domain),
  )

  response.headers.set(
    'X-Nextjs-Redirect',
    `/${companyName}${path.replace(companyNameRegex, '')}`,
  )
  return response

  // if (path.includes(companyName)) {
  //   return NextResponse.redirect(new URL(`/${path}`, domain))
  // }

  // console.log(request.nextUrl.pathname, 'request')
  // console.log(request.cookies)

  // console.log(new URL(`/${companyName}/${path}`, request.url), 'new URL')
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|locales).*)'],
}
