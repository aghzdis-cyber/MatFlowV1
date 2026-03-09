import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "admin@matflow.com" },
                password: { label: "Mot de passe", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email) {
                    return null
                }

                // Pour la démonstration / développement initial, on accepte l'email
                // sans vérifier de mot de passe complexe, si l'email existe.
                // TODO: Implémenter le hachage de mot de passe avec bcrypt
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (user) {
                    return { id: user.id, name: user.name, email: user.email, role: user.role }
                }

                return null
            }
        })
    ],
    session: {
        strategy: "jwt", // Use JWT for session to work well with App Router
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role as string
                session.user.id = token.id as string
            }
            return session
        }
    },
    pages: {
        // signIn: '/login', // TODO: Créer une page de login personnalisée plus tard
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
