import { db } from '$lib/db/xata-util';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
	const search = url.searchParams.get('search') ?? '';

	const session = await locals.auth();

	if (!session) {
		throw redirect(303, `/signin?redirectTo=${encodeURIComponent(url.pathname + url.search)}`);
	}

	const polls = await db
		.selectFrom('polls')
		.select(['polls.id', 'polls.content', 'polls.downvotes', 'polls.upvotes'])
		.where('polls.created_by', '=', session.user.userId)
		.where('polls.content', 'ilike', `%${search}%`)
		.leftJoin('votes', (join) =>
			join.onRef('votes.poll_id', '=', 'polls.id').on('votes.created_by', '=', session.user.userId)
		)
		.select('votes.type as voteType')
		.orderBy('polls.upvotes', 'desc')
		.execute();

	return {
		polls,
		search
	};
};
