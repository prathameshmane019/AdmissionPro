import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "@/app/lib/connectDb";
import Faculty from '@/app/model/faculty';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials) {
        try {
          await connectMongoDB();
          const { userId, password } = credentials;
          const user = await Faculty.findOne({
            $or: [
              { email: userId },
              { mobile: userId },
              { name: userId }
            ]
          });

          if (!user) {
            throw new Error('User not found');
          }

          const isVerified = (user.password === password);
          if (!isVerified) {
            throw new Error('Invalid credentials');
          }

          let userRole = user.department === "Central" ? "admin" : "faculty";
          return { ...user.toObject(), role: userRole };
        } catch (error) {
          console.error('Error during authorization:', error);
          throw new Error('Authorization failed');
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
