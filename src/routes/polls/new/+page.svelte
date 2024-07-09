<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { wordCount } from '$lib/utils';
	import { superForm } from 'sveltekit-superforms';

	export let data;

	const { form, enhance } = superForm(data.form);
</script>

<div class="flex h-svh flex-col place-items-center justify-center gap-10 px-6">
	{#if $form.content.trim() != ''}
		<h1 class="min-h-[72px] max-w-3xl text-center text-5xl font-bold sm:text-7xl">
			{$form.content}
		</h1>
	{:else}
		<h1
			class="min-h-[72px] max-w-3xl text-center text-5xl font-bold text-muted-foreground sm:text-7xl"
		>
			Minimum of 3 words
		</h1>
	{/if}
	<form
		use:enhance
		method="POST"
		class="flex w-full max-w-[350px] flex-col place-items-end justify-end gap-2"
	>
		<Textarea bind:value={$form.content} name="content" placeholder="Minimum of 3 words" />
		<input type="text" bind:value={$form.createdBy} name="createdBy" class="hidden" />
		<Button type="submit" disabled={wordCount($form.content) < 3}>Post</Button>
	</form>
</div>
