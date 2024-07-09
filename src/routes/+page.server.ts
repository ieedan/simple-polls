import { db } from '$lib/db/xata-util';

export const load = async ({ locals }) => {
	const session = await locals.auth();

	const userId = session?.user.userId ?? "";

	const polls = await db
		.selectFrom('polls')
		.where('created_by', '!=', userId)
		.selectAll()
		.limit(10)
		.orderBy('polls.views', 'desc')
		.orderBy('polls.upvotes', 'desc')
		.execute();

	return {
		polls
	};
};
