<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { wordCount } from '$lib/utils';
	import { superForm } from 'sveltekit-superforms';

	export let data;

	const { form, enhance } = superForm(data.form);
</script>

<div class="flex h-svh flex-col place-items-center justify-center gap-10 px-6">
	<h1 class="max-w-3xl text-center text-5xl font-bold sm:text-7xl">
		{$form.content}
	</h1>
	<form use:enhance method="POST" class="flex flex-col gap-2 justify-end place-items-end">
		<Textarea bind:value={$form.content} name="content" class="max-w-[400px]" placeholder="Minimum of 3 words"/>
		<input type="text" bind:value={$form.createdBy} name="createdBy" class="hidden"/>
        <Button type="submit" disabled={wordCount($form.content) < 3}>
            Post
        </Button>
	</form>
</div>
