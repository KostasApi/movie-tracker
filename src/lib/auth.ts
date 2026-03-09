import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  pages: { signIn: '/login' },
  callbacks: {
    session({ session, token }) {
      // Expose provider account ID as user.id for DB queries
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
