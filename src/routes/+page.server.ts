import { db } from '$lib/db/xata-util';

export const load = async () => {
	const polls = await db
		.selectFrom('polls')
		.selectAll()
		.limit(10)
		.orderBy('polls.views', 'desc')
		.orderBy('polls.upvotes', 'desc')
		.execute();

	return {
		polls
	};
};
