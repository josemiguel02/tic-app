import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET_SEED!

export const middleware = async (req: NextRequest) => {
  const token = req.cookies.get('auth-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    return NextResponse.next()
  } catch (e) {
    return NextResponse.redirect(new URL('/', req.url))
  }
}

export const config = {
  matcher: [
    '/inicio',
    '/examen',
    '/examen-terminado',
    '/dashboard/:path*',
    '/api/admin/:path*',
    '/api/quiz/:path*'
  ]
}
