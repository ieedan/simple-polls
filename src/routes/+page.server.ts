import { db } from '$lib/db/xata-util';

export const load = async () => {
	const polls = await db
		.selectFrom('polls')
		.selectAll()
		.limit(5)
		.orderBy('polls.upvotes', 'desc')
		.execute();

	return {
		polls
	};
};
