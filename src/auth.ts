import { providers } from '$lib/auth/providers';
import { SvelteKitAuth, type DefaultSession } from '@auth/sveltekit';

declare module "@auth/sveltekit" {
	interface Session {
	  user: {
		userId: string | undefined
		/**
		 * By default, TypeScript merges new interface properties and overwrites existing ones.
		 * In this case, the default session user properties will be overwritten,
		 * with the new ones defined above. To keep the default session user properties,
		 * you need to add them back into the newly declared interface.
		 */
	  } & DefaultSession["user"]
	}
  }

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers,
	pages: {
		signIn: '/signin',
	},
	callbacks: {
		session: async ({ session, token }) => {
		  if (token) {
			session.user.userId = token.sub
		  }
		  // `session.user.userId` is now a valid property, and will be type-checked
		  // in places like `useSession().data.user` or `auth().user`
		  return session
		},
	  },
});
