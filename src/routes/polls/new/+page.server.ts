import { db } from '$lib/db/xata-util.js';
import { rand } from '$lib/utils';
import { redirect } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const poll = z.object({
	content: z.string(),
	createdBy: z.string()
});

const adjectives = [
	'great',
	'awful',
	'wonderful',
	'fun',
	'silly',
	'ignorant',
	'playful',
	'jumpy',
	'stumped',
	'difficult',
	'unreal',
	'incredible',
	'outstanding',
	'smart',
	'dumb',
	'hard',
	'wrong',
	'tasty',
	'stubborn',
	'brave',
	'lazy',
	'cheerful',
	'moody',
	'elegant',
	'clumsy',
	'generous',
	'greedy',
	'honest',
	'deceitful',
	'polite',
	'rude',
	'optimistic',
	'pessimistic',
	'creative',
	'uncreative',
	'energetic',
	'lethargic',
	'friendly',
	'hostile'
];

const objects: {
	name: string;
	verb: 'are' | 'is';
}[] = [
	{ name: 'apples', verb: 'are' },
	{ name: 'cars', verb: 'are' },
	{ name: 'books', verb: 'are' },
	{ name: 'chairs', verb: 'are' },
	{ name: 'laptops', verb: 'are' },
	{ name: 'phones', verb: 'are' },
	{ name: 'tables', verb: 'are' },
	{ name: 'lamps', verb: 'are' },
	{ name: 'jackets', verb: 'are' },
	{ name: 'pillows', verb: 'are' },
	{ name: 'bicycles', verb: 'are' },
	{ name: 'bottles', verb: 'are' },
	{ name: 'cameras', verb: 'are' },
	{ name: 'keyboards', verb: 'are' },
	{ name: 'monitors', verb: 'are' },
	{ name: 'pens', verb: 'are' },
	{ name: 'plants', verb: 'are' },
	{ name: 'shoes', verb: 'are' },
	{ name: 'speakers', verb: 'are' },
	{ name: 'watches', verb: 'are' },
	{ name: 'baskets', verb: 'are' },
	{ name: 'candles', verb: 'are' },
	{ name: 'clocks', verb: 'are' },
	{ name: 'fans', verb: 'are' },
	{ name: 'frames', verb: 'are' },
	{ name: 'gloves', verb: 'are' },
	{ name: 'guitars', verb: 'are' },
	{ name: 'hats', verb: 'are' },
	{ name: 'knives', verb: 'are' },
	{ name: 'mugs', verb: 'are' },
	{ name: 'notebooks', verb: 'are' },
	{ name: 'rings', verb: 'are' },
	{ name: 'scarves', verb: 'are' },
	{ name: 'spoons', verb: 'are' },
	{ name: 'suitcases', verb: 'are' },
	{ name: 'toothbrushes', verb: 'are' },
	{ name: 'umbrellas', verb: 'are' },
	{ name: 'vases', verb: 'are' }
];

export const load = async ({ url, locals }) => {
	let title = url.searchParams.get('title');

	const session = await locals.auth();

	if (!session) {
		throw redirect(303, `/signin?redirectTo=${encodeURIComponent(url.pathname + url.search)}`);
	}

	if (title == null) {
		const adjectiveIndex = rand(0, adjectives.length - 1);
		const objectIndex = rand(0, objects.length - 1);

		title = `${objects[objectIndex].name} ${objects[objectIndex].verb} ${adjectives[adjectiveIndex]}`;
	}

	const form = await superValidate({ content: title, createdBy: session.user.userId }, zod(poll));

	return {
		form
	};
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(poll));

		if (!form.valid) {
			return fail(400, { form });
		}

		const pollId = await db
			.insertInto('polls')
			.values({ content: form.data.content, created_by: form.data.createdBy })
			.returning(['id'])
			.executeTakeFirst();

        if (!pollId) {
            return fail(400, { form });
        }

		throw redirect(303, `/polls/${pollId.id}`);
	}
};
