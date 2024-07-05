import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./db";
import NextAuth, { getServerSession } from "next-auth/next";

const adminEmails = ["balyuvraj14@gmail.com"];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({ session, token, user }) => {
      if (adminEmails.includes(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
};

export async function isAdminRequest(req) {
  const session = await getServerSession(authOptions);
  if (adminEmails.includes(session?.user?.email)) {
    return true;
  } else {
    return false;
  }
}
/*
The NextAuthOptions object is a configuration object that you can pass to the 
NextAuth function to configure the authentication providers that you want to use. 
In this case, we are using the GoogleProvider to configure the Google authentication provider.
*/
