import type { Provider } from '@auth/sveltekit/providers';
import GitHub from '@auth/sveltekit/providers/github';

export const providers: Provider[] = [GitHub];

export const providerMap = providers.map((provider) => {
	if (typeof provider === 'function') {
		const providerData = provider();
		return { id: providerData.id, name: providerData.name };
	} else {
		return { id: provider.id, name: provider.name };
	}
});
