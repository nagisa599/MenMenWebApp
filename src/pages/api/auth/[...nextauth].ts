import CredentialsProvider from "next-auth/providers/credentials"
import NextAuth from "next-auth"
import { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        mail: { label: 'mail', type: 'email', placeholder: 'メールアドレス' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials, req): Promise<any> {
        if (
          // ログインID・パスワードは環境変数にて設定する。
          credentials?.mail === process.env.NEXT_PUBLIC_LOGIN_ID &&
          credentials?.password === process.env.NEXT_PUBLIC_PASSWORD
        ) {
          // ログイン成功後ユーザー情報を返却する。値はsessionに格納される。
          return Promise.resolve({ name: 'admin' })
        } else {
          // ログイン失敗後認証を拒否し、エラーメッセージを返却する。
          return Promise.resolve(null)
        }
      }
    }),
  ],
  pages: {
    signIn: '/Log',
  },
}

export default NextAuth(authOptions)
