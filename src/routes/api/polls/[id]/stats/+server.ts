import { db } from '$lib/db/xata-util.js';
import { json } from '@sveltejs/kit';

export const GET = async ({ params }) => {
	const stats = await db
		.selectFrom('polls')
		.select(['upvotes', 'downvotes'])
		.where('polls.id', '=', params.id)
		.executeTakeFirst();

	const downvotes = stats?.downvotes;

	// this shouldn't ever happen
	if (typeof downvotes != 'number') {
		throw new Error('incorrect type received');
	}

	const upvotes = stats?.upvotes;

	// this shouldn't ever happen
	if (typeof upvotes != 'number') {
		throw new Error('incorrect type received');
	}

	return json({ upvotes, downvotes });
};
