import NextAuth from 'next-auth'
import type { JWT } from 'next-auth/jwt'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: 'logto',
      name: 'Logto',
      type: 'oidc',
      issuer: process.env.LOGTO_ISSUER,
      clientId: process.env.LOGTO_CLIENT_ID,
      clientSecret: process.env.LOGTO_CLIENT_SECRET,
      authorization: {
        params: { scope: 'openid offline_access profile email', prompt: 'login' },
      },
      profile(profile) {
        console.log('profile', profile)
        // You can customize the user profile mapping here
        return {
          id: profile.sub,
          name: profile.name ?? profile.username,
          email: profile.email,
          image: profile.picture,
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, account }) {
      console.log('account', account)
      return token
    },
  },
  events: {
    async signOut(arg) {
      const { token } = arg as { token: JWT }
      console.log('arg', arg)
      const response = await fetch(`${process.env.LOGTO_ISSUER}/session/end?client_id=${process.env.LOGTO_CLIENT_ID}`)
      console.log(response)
      return
    },
  },
})
