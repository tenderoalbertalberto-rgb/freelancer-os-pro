// ========================================================================
// Freelancer OS Pro - API Route de NextAuth
// Repo: github.com/tenderoalbertalberto-rgb/freelancer-os-pro
// ========================================================================

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
