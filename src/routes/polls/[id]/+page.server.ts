import { db, VoteType } from '$lib/db/xata-util.js';
import { redirect } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const upvote = z.object({
	submittedBy: z.string(),
	upvoted: z.boolean(),
	downvoted: z.boolean(),
	pollId: z.string()
});

const downvote = z.object({
	submittedBy: z.string(),
	downvoted: z.boolean(),
	pollId: z.string()
});

export const load = async ({ params, locals }) => {
	const session = await locals.auth();

	const poll = await db
		.selectFrom('polls')
		.selectAll()
		.where('polls.id', '=', params.id)
		.executeTakeFirst();

	await db
		.updateTable('polls')
		.set((eb) => ({
			views: eb('views', '+', 1)
		}))
		.where('polls.id', '=', params.id)
		.execute();

	if (!poll) {
		throw redirect(302, '/polls');
	}

	// because why does it not just come out as a number
	const upvotes = poll.upvotes;

	// Shouldn't ever happen just here for TS
	if (typeof upvotes != 'number') {
		throw redirect(302, '/polls');
	}

	// because why does it not just come out as a number
	const downvotes = poll.downvotes;

	// Shouldn't ever happen just here for TS
	if (typeof downvotes != 'number') {
		throw redirect(302, '/polls');
	}

	let upVoted = false;
	let downVoted = false;

	if (session) {
		const vote = await db
			.selectFrom('votes')
			.select(['type'])
			.where('poll_id', '=', poll.id)
			.where('created_by', '=', session.user.userId)
			.executeTakeFirst();

		if (vote) {
			if (vote.type == VoteType.UP) {
				upVoted = true;
			} else if (vote.type == VoteType.DOWN) {
				downVoted = true;
			}
		}
	}

	const upvoteForm = await superValidate(
		{ pollId: poll.id, upvoted: upVoted, submittedBy: session?.user.userId },
		zod(upvote)
	);

	const downvoteForm = await superValidate(
		{ pollId: poll.id, downvoted: downVoted, submittedBy: session?.user.userId },
		zod(downvote)
	);

	return {
		poll: { ...poll, upvotes, downvotes },
		upvoteForm,
		downvoteForm
	};
};

export const actions = {
	upvote: async ({ request, locals, url }) => {
		const session = await locals.auth();

		if (!session) {
			throw redirect(303, `/signin?redirectTo=${encodeURIComponent(url.pathname + url.search)}`);
		}

		const form = await superValidate(request, zod(upvote));

		if (!form.valid) {
			return fail(400, { form });
		}

		const currentVoteType = await db
			.selectFrom('votes')
			.select('type')
			.where('poll_id', '=', form.data.pollId)
			.where('created_by', '=', form.data.submittedBy)
			.executeTakeFirst();

		if (currentVoteType == undefined) {
			// has not voted yet
			// shouldn't be possible to be transitioning to a false state

			const upvoteId = await db
				.insertInto('votes')
				// add the blank id or TS yells at you
				.values({
					id: '',
					created_by: form.data.submittedBy,
					poll_id: form.data.pollId,
					type: VoteType.UP
				})
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
			if (currentVoteType.type == VoteType.UP) {
				// hasn't already been voted to the correct state
				if (!form.data.upvoted) {
					await db
						.deleteFrom('votes')
						.where('poll_id', '=', form.data.pollId)
						.where('created_by', '=', form.data.submittedBy)
						.execute();

					await db
						.updateTable('polls')
						.set((eb) => ({
							upvotes: eb('upvotes', '-', 1)
						}))
						.where('polls.id', '=', form.data.pollId)
						.execute();
				}
			} else if (currentVoteType.type == VoteType.DOWN) {
				if (form.data.upvoted) {
					// upvoting
					await db
						.updateTable('votes')
						.set({ type: VoteType.UP })
						.where('poll_id', '=', form.data.pollId)
						.where('created_by', '=', form.data.submittedBy)
						.execute();

					await db
						.updateTable('polls')
						.set((eb) => ({
							downvotes: eb('downvotes', '-', 1),
							upvotes: eb('upvotes', '+', 1)
						}))
						.where('polls.id', '=', form.data.pollId)
						.execute();
				}
			}
		}
	},
	downvote: async ({ request, locals, url }) => {
		const session = await locals.auth();

		if (!session) {
			throw redirect(303, `/signin?redirectTo=${encodeURIComponent(url.pathname + url.search)}`);
		}

		const form = await superValidate(request, zod(downvote));

		if (!form.valid) {
			return fail(400, { form });
		}

		const currentVoteType = await db
			.selectFrom('votes')
			.select('type')
			.where('poll_id', '=', form.data.pollId)
			.where('created_by', '=', form.data.submittedBy)
			.executeTakeFirst();

		if (currentVoteType == undefined) {
			// has not voted yet
			// shouldn't be possible to be transitioning to a false state

			const upvoteId = await db
				.insertInto('votes')
				// add the blank id or TS yells at you
				.values({
					id: '',
					created_by: form.data.submittedBy,
					poll_id: form.data.pollId,
					type: VoteType.DOWN
				})
				.returning('id')
				.executeTakeFirst();

			if (!upvoteId) {
				return fail(400, { form });
			}

			await db
				.updateTable('polls')
				.set((eb) => ({
					downvotes: eb('downvotes', '+', 1)
				}))
				.where('polls.id', '=', form.data.pollId)
				.execute();
		} else {
			if (currentVoteType.type == VoteType.DOWN) {
				// hasn't already been voted to the correct state
				if (!form.data.downvoted) {
					await db
						.deleteFrom('votes')
						.where('poll_id', '=', form.data.pollId)
						.where('created_by', '=', form.data.submittedBy)
						.execute();

					await db
						.updateTable('polls')
						.set((eb) => ({
							downvotes: eb('downvotes', '-', 1)
						}))
						.where('polls.id', '=', form.data.pollId)
						.execute();
				}
			} else if (currentVoteType.type == VoteType.UP) {
				if (form.data.downvoted) {
					// downvoting
					await db
						.updateTable('votes')
						.set({ type: VoteType.DOWN })
						.where('poll_id', '=', form.data.pollId)
						.where('created_by', '=', form.data.submittedBy)
						.execute();

					await db
						.updateTable('polls')
						.set((eb) => ({
							downvotes: eb('downvotes', '+', 1),
							upvotes: eb('upvotes', '-', 1)
						}))
						.where('polls.id', '=', form.data.pollId)
						.execute();
				}
			}
		}
	}
};
