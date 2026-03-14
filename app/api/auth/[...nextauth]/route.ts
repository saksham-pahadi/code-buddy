import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import connectDB from "@/lib/db"
import User from "@/Models/User"
import type { SessionStrategy } from "next-auth"

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],

  session: { strategy: "jwt" as SessionStrategy },

  callbacks: {
    async signIn({ user, account }: { user: import("next-auth").User; account: import("next-auth").Account | null }) {
      if (!account) return false

      await connectDB()

      let currentUser = await User.findOne({ email: user.email })

      if (!currentUser) {
        currentUser = await User.create({
          email: user.email,
          name: user.name || user.email?.split("@")[0],
          username: user.email?.split("@")[0],
          profilepic: account.provider === "github" ? user.image : null,
          provider: account.provider,
        })
      }

      if (account.provider === "github" && currentUser.profilepic === null) {
        currentUser.profilepic = user.image
        await currentUser.save()
      }

      return true
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }