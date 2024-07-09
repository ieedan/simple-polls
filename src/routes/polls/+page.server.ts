import { db } from '$lib/db/xata-util.js';

export const load = async ({ url }) => {
	const search = url.searchParams.get('search') ?? '';

	const polls = await db
		.selectFrom('polls')
		.selectAll()
		.where('polls.content', 'ilike', `%${search}%`)
		.orderBy("polls.views", 'desc')
		.orderBy('polls.upvotes', 'desc')
		.limit(100)
		.execute();

	return {
		polls,
		search
	};
};
