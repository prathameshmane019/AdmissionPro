import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB} from "@/app/lib/connectDb"
import Faculty from '@/app/model/faculty';

export const authOptions = ({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials) {
        try {
          await connectMongoDB();
      
          const Id = credentials.userId;
          const password = credentials.password;
          let userRole;
          let id;
          console.log(credentials);
          const user = await Faculty.findOne({ _id: Id });
          console.log(department);
          if (user._id.startsWith("A")) {
            userRole = "admin";
            id = admin._id;
          }
          else if(user){
            userRole = "faculty";
            id = admin._id;
          } else {
            return null;
          }
          const isVerified = (user && user.password === password);
          console.log(isVerified);
          if (isVerified) {
            const userWithRole = {
              ...user?.toObject(), // Optional chaining to prevent errors if user is null
              role: userRole,
              id: id,// Add department name to user object
            };
            return Promise.resolve(userWithRole);
          } else {
            return null; // Return null if credentials are invalid
          }
        } catch (error) {
          console.error('Error during authorization:', error);
          return null;
        }
      }
    }),
  ],
  session: {
    sessionCallback: async (session, user) => {
      session.user = { ...user, role: user.role, id: user.id}; // Add department name to the session
      return Promise.resolve(session);
    },
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.role = user.role;
        token.id = user.id; // Add department name to the token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.role = token.role;
      session.user.id = token.id; // Add department name to the session
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/", // Customize the sign-in page route as needed
  },
});

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
