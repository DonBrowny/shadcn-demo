import NextAuth, { type DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      roles: string[]
    } & DefaultSession['user']
  }
  interface User {
    organization_roles: string[]
  }
}

function getRolesFromProfile(roles: string[], orgId: string) {
  return roles.filter((role: string) => role.startsWith(orgId)).map((x: string) => x.replace(`${orgId}:`, ''))
}

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
        params: {
          scope: 'openid offline_access profile roles urn:logto:scope:organizations urn:logto:scope:organization_roles',
          prompt: 'login',
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.username,
          email: profile.email,
          image: profile.picture,
          organization_roles: profile.organization_roles,
        }
      },
    },
  ],
  callbacks: {
    async signIn({ user }) {
      return getRolesFromProfile(user.organization_roles, process.env.LOGTO_ORG_ID || '').length > 0
    },
    async jwt({ token, account, profile }) {
      if (profile && account) {
        token.id = profile.sub
        token.accessToken = account.access_token
        token.roles = getRolesFromProfile(profile.organization_roles as string[], process.env.LOGTO_ORG_ID || '')
      }
      return token
    },
    async session({ session, token, user }) {
      session.user.id = token.id as string
      session.user.roles = token.roles as string[]

      return session
    },
  },
  events: {
    async signOut(arg) {
      await fetch(`${process.env.LOGTO_ISSUER}/session/end?client_id=${process.env.LOGTO_CLIENT_ID}`)
    },
  },
})
