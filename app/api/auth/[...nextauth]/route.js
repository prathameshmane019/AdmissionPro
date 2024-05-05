import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "@/app/lib/connectDb";
import Faculty from '@/app/model/faculty';

export const authOptions = ({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials) {
        try {
          await connectMongoDB();
          const email = credentials.userId;
          const password = credentials.password;
console.log(email);
          // Find user by email
          const user = await Faculty.findOne({ email });
console.log(user);
          if (!user) {
            // User not found
            return null;
          }

          const isVerified = (user.pwd === password);

          if (!isVerified) {
            return null;
          }

          const userRole = user.isAdmin ? "admin" : "faculty";

          return { ...user.toObject(), role: userRole };
        } catch (error) {
          console.error('Error during authorization:', error);
          return null;
        }
      }
    }),
  ],
  session: {
    sessionCallback: async (session, user) => {
      session.user = { ...user, role: user.role }; 
      return session;
    },
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.role = token.role;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
});

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
