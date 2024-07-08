import { providers } from '$lib/auth/providers';
import { SvelteKitAuth } from '@auth/sveltekit';

export const { handle, signIn, signOut } = SvelteKitAuth({
	providers,
	pages: {
		signIn: '/signin'
	}
});
