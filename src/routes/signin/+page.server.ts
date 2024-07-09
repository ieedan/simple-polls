import { redirect } from '@sveltejs/kit';
import { signIn } from '../../auth';
import type { Actions } from './$types';

export const load = async ({ locals, url }) => {
	const session = await locals.auth();

    const redirectTo = url.searchParams.get('redirectTo') ?? "/";

    if (session) {
        throw redirect(303, redirectTo);
    }
};

export const actions: Actions = { default: signIn };
