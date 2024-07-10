import { db } from '$lib/db/xata-util';

export const load = async ({ locals }) => {
	const session = await locals.auth();

	const userId = session?.user.userId ?? '';

	const polls = await db
		.selectFrom('polls')
		.select(['polls.id', 'polls.content', 'polls.downvotes', 'polls.upvotes'])
		.where('polls.created_by', '!=', userId)
		.leftJoin('votes', (join) =>
			join.onRef('votes.poll_id', '=', 'polls.id').on('votes.created_by', '=', userId)
		)
		.where(({ eb, and, or }) =>
			and([or([eb('votes.created_by', '!=', userId), eb('votes.created_by', 'is', null)])])
		)
		.limit(10)
		.orderBy('polls.views', 'desc')
		.orderBy('polls.upvotes', 'desc')
		.execute();

	return {
		polls
	};
};
