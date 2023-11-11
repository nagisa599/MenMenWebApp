// src/middleware.ts

import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

// 管理者権限が必要なパス一覧
const adminOnlyPathRegexs = [
  new RegExp(`^/xxx/.*$`)
];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // 管理者権限のないユーザーが管理者権限が必要なパスにアクセスした場合は404
    if (
      req.nextauth.token?.userRole !== "admin" &&
      adminOnlyPathRegexs.some((regex) => regex.test(pathname))
    ) {
      return NextResponse.rewrite(new URL('/404', req.url));
    }
  }
);

export const config = {
  // ログインページ（/login）以外を対象にする
  matcher: '/singin',
};