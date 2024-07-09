import { db } from "$lib/db/xata-util";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals, url }) => {
    const search = url.searchParams.get('search') ?? '';

	const session = await locals.auth();

    if (!session) {
		throw redirect(303, `/signin?redirectTo=${encodeURIComponent(url.pathname + url.search)}`);
	}

	const polls = await db
		.selectFrom('polls')
		.selectAll()
        .where('polls.created_by', '=', session.user.userId)
        .where('polls.content', 'ilike', `%${search}%`)
		.orderBy('polls.upvotes', 'desc')
		.execute();

    return {
        polls,
        search
    }
};
