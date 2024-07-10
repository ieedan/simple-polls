import type { Provider } from '@auth/sveltekit/providers';
import GitHub from '@auth/sveltekit/providers/github';
import google from '@auth/sveltekit/providers/google';

export const providers: Provider[] = [GitHub, google];

export const providerMap = providers.map((provider) => {
	if (typeof provider === 'function') {
		const providerData = provider();
		return { id: providerData.id, name: providerData.name };
	} else {
		return { id: provider.id, name: provider.name };
	}
});
