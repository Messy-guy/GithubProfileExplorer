import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authoption: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: { params: { scope: "repo read:user user:email user:follow gists stars" } }, // optional but useful
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // ✅ REQUIRED
  session: {
    strategy: "jwt", // ✅ REQUIRED if you're not using a DB
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  debug: true, // ✅ shows helpful logs in the terminal
};
