<script lang="ts">
	import Toggle from '$lib/components/ui/toggle/toggle.svelte';
	import ThickArrowUp from 'svelte-radix/ThickArrowUp.svelte';
	import ThickArrowDown from 'svelte-radix/ThickArrowDown.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { page } from '$app/stores';

	export let data;

	const { form: upvoteForm, enhance: upvoteEnhance } = superForm(data.upvoteForm);
	const { form: downvoteForm, enhance: downvoteEnhance } = superForm(data.downvoteForm);
</script>

<svelte:head>
	<title>Poll | {data.poll.content}</title>
</svelte:head>

<section class="flex h-svh flex-col place-items-center justify-center gap-4 px-6">
	<h1 class="text-center text-5xl font-bold sm:text-7xl">
		{data.poll.content}
	</h1>
	<div class="flex place-items-center gap-2">
		<form method="POST" action="?/upvote" use:upvoteEnhance>
			<Toggle
				type="submit"
				variant="outline"
				class="flex gap-2"
				bind:pressed={$upvoteForm.upvoted}
				onPressedChange={(upvoted) => {
					if (!$page.data.session) return; 
					if (upvoted) {
						if ($downvoteForm.downvoted) {
							$downvoteForm.downvoted = false
							data.poll.downvotes -= 1;
						}
						data.poll.upvotes += 1;
					} else {
						data.poll.upvotes -= 1;
					}
				}}
			>
				<ThickArrowUp class="size-4" />
				<span class="font-serif">{data.poll.upvotes}</span>
			</Toggle>
			<input type="checkbox" bind:checked={$upvoteForm.upvoted} class="hidden" name="upvoted" />
			<input name="submittedBy" class="hidden" bind:value={$upvoteForm.submittedBy} />
			<input name="pollId" class="hidden" bind:value={$upvoteForm.pollId} />
		</form>
		<form method="POST" action="?/downvote" use:downvoteEnhance>
			<Toggle
				type="submit"
				variant="outline"
				class="flex gap-2"
				bind:pressed={$downvoteForm.downvoted}
				onPressedChange={(downvoted) => {
					if (!$page.data.session) return; 
					if (downvoted) {
						if ($upvoteForm.upvoted) {
							$upvoteForm.upvoted = false
							data.poll.upvotes -= 1;
						}
						data.poll.downvotes += 1;
					} else {
						data.poll.downvotes -= 1;
					}
				}}
			>
				<ThickArrowDown class="size-4" />
				<span class="font-serif">{data.poll.downvotes}</span>
			</Toggle>
			<input type="checkbox" bind:checked={$downvoteForm.downvoted} class="hidden" name="downvoted" />
			<input name="submittedBy" class="hidden" bind:value={$downvoteForm.submittedBy} />
			<input name="pollId" class="hidden" bind:value={$downvoteForm.pollId} />
		</form>
	</div>
</section>
