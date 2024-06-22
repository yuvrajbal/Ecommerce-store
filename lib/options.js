import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./db";
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
};
/*
The NextAuthOptions object is a configuration object that you can pass to the 
NextAuth function to configure the authentication providers that you want to use. 
In this case, we are using the GoogleProvider to configure the Google authentication provider.
*/
