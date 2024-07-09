<script lang="ts">
	import Toggle from '$lib/components/ui/toggle/toggle.svelte';
	import ThickArrowUp from 'svelte-radix/ThickArrowUp.svelte';
	import { superForm } from 'sveltekit-superforms';

	export let data;

	const { form, enhance } = superForm(data.form);
</script>

<section class="flex h-svh flex-col place-items-center justify-center gap-4 px-6">
	<h1 class="text-center text-5xl font-bold sm:text-7xl">
		{data.poll?.content}
	</h1>
	<form method="POST" use:enhance>
		<Toggle
			type="submit"
			variant="outline"
			class="flex gap-2"
			bind:pressed={$form.upvoted}
			onPressedChange={(upvoted) => {
				if (upvoted) {
					data.poll.upvotes += 1;
				} else {
					data.poll.upvotes -= 1;
				}
			}}
		>
			<ThickArrowUp class="size-4" />
			<span class="font-serif">{data.poll.upvotes}</span>
		</Toggle>
		<input type="checkbox" bind:checked={$form.upvoted} class="hidden" name="upvoted" />
		<input name="upvotedBy" class="hidden" bind:value={$form.upvotedBy} />
		<input name="pollId" class="hidden" bind:value={$form.pollId} />
	</form>
</section>
