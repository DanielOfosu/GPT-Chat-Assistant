import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const googleid: string | undefined = process.env.GOOGLE_ID
const googlesecret: string | undefined = process.env.GOOGLE_SECRET

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: googleid!,
      clientSecret: googlesecret!,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  jwt: {
    secret: process.env.AUTH_SECRET,
  },
  pages: {
  },
  callbacks: {
    session({ session, token, user }) {
        return session // The return type will match the one returned in `useSession()`
      },
  },
  events: {},
  debug: true,
})