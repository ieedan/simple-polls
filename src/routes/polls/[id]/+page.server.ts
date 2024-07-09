import { db } from '$lib/db/xata-util.js';
import { redirect } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const upvote = z.object({
	upvotedBy: z.string(),
	upvoted: z.boolean(),
	pollId: z.string()
});

export const load = async ({ params, locals }) => {
	const poll = await db
		.selectFrom('polls')
		.selectAll()
		.where('id', '=', params.id)
		.executeTakeFirst();

	if (!poll) {
		throw redirect(302, '/polls');
	}

    // because why does it not just come out as a number
	const upvotes = poll.upvotes;

    // Shouldn't ever happen just here for TS
	if (typeof upvotes != 'number') {
		throw redirect(302, '/polls');
	}

	const session = await locals.auth();

	let upVoted = false;

	if (session) {
		const upvote = await db
			.selectFrom('upvotes')
			.select(['id'])
			.where('poll_id', '=', poll.id)
			.where('upvoted_by', '=', session.user.userId)
			.executeTakeFirst();

		if (upvote) {
			upVoted = true;
		}
	}

	const form = await superValidate(
		{ pollId: poll.id, upvoted: upVoted, upvotedBy: session?.user.userId },
		zod(upvote)
	);

	return {
		poll: { ...poll, upvotes },
		upVoted,
		form
	};
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(upvote));

		if (!form.valid) {
			return fail(400, { form });
		}

		console.log(form);

		if (form.data.upvoted) {
			const upvoteId = await db
				.insertInto('upvotes')
                // add the blank id or TS yells at you
				.values({ id: "", upvoted_by: form.data.upvotedBy, poll_id: form.data.pollId })
				.returning('id')
				.executeTakeFirst();

			if (!upvoteId) {
				return fail(400, { form });
			}

			await db
				.updateTable('polls')
				.set((eb) => ({
					upvotes: eb('upvotes', '+', 1)
				}))
				.where('polls.id', '=', form.data.pollId)
				.execute();
		} else {
			await db
				.deleteFrom('upvotes')
				.where('poll_id', '=', form.data.pollId)
				.where('upvoted_by', '=', form.data.upvotedBy)
				.executeTakeFirst();

			await db
				.updateTable('polls')
				.set((eb) => ({
					upvotes: eb('upvotes', '-', 1)
				}))
				.where('polls.id', '=', form.data.pollId)
				.execute();
		}
	}
};
