import { authoption } from "@/lib/authoption";
import NextAuth from "next-auth";


const handle = NextAuth(authoption);

export {handle as GET , handle as POST};