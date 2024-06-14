import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const regex = /\/\[companyName\]\//g

  const path = request.nextUrl.pathname.replace(regex, '/')

  const companyName = request.cookies.get('companyName')?.value ?? ''

  const companyNameRegex = new RegExp(`/${companyName}`, 'g')

  // console.log(path.includes(companyName), path, companyName)

  const url = new URL(request.url)
  const domain = url.origin

  const searchParams = new URLSearchParams(request.nextUrl.search)
  if (searchParams.has('companyName')) {
    searchParams.delete('companyName')
  }
  const modifiedSearch = searchParams.toString()
  const finalUrl = new URL(
    `/${companyName}${path.replace(companyNameRegex, '')}${modifiedSearch ? '?' + modifiedSearch : ''}`,
    domain,
  )

  const pathUrl = new URL(path, domain)

  if (
    path.includes('login') ||
    // path === '/login/' ||
    // path === `/${companyName}/login/` ||
    finalUrl.toString() === pathUrl.toString()
    // ||path.split('/')[1] === companyName
    // ||
  ) {
    return NextResponse.next()
  }

  const response = NextResponse.redirect(finalUrl)

  response.headers.set('X-Nextjs-Redirect', finalUrl.toString())
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
