import { db } from '$lib/db/xata-util.js';

export const load = async ({ locals, url }) => {
	const search = url.searchParams.get('search') ?? '';

	const session = await locals.auth();

	const userId = session?.user.userId ?? '';

	const polls = await db
		.selectFrom('polls')
		.select(['polls.id', 'polls.content', 'polls.downvotes', 'polls.upvotes'])
		.where('polls.content', 'ilike', `%${search}%`)
		.leftJoin('votes', (join) =>
			join.onRef('votes.poll_id', '=', 'polls.id').on('votes.created_by', '=', userId)
		)
		.select('votes.type as voteType')
		.orderBy('polls.views', 'desc')
		.orderBy('polls.upvotes', 'desc')
		.orderBy('polls.downvotes', 'desc')
		.limit(100)
		.execute();

	return {
		polls,
		search
	};
};
