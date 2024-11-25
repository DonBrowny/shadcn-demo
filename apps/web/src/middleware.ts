import { auth } from './auth'
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const secret = process.env.AUTH_SECRET
const API_URL = process.env.FUEL_API_URL

const PUBLIC_ROUTES = ['/login']

export default auth(async (req) => {
  const { nextUrl } = req
  const { pathname } = nextUrl

  if (pathname.startsWith('/proxy-api')) {
    const token = await getToken({ req, secret, cookieName: 'shadcn-demo-session' })
    const authJwt = token?.accessToken
    if (!authJwt) {
      Response.redirect(new URL('/error?error=AccessDenied', nextUrl))
    }
    req.headers.set('Authorization', `Bearer ${authJwt}`)
    req.headers.set('Content-Type', 'application/json')
    const updatedPathName = pathname.replace('/proxy-api', '')
    return NextResponse.rewrite(`${API_URL}${updatedPathName}${nextUrl.search}`, {
      request: {
        headers: req.headers,
      },
    })
  }
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)
  const isAuthenticated = !!req.auth

  // if (!isAuthenticated && !isPublicRoute) return Response.redirect(new URL('/error?error=AccessDenied', nextUrl))
  if (!isAuthenticated && !isPublicRoute) {
    return Response.redirect(new URL('/login', nextUrl))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
}
