<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { ArrowRight } from 'svelte-radix';
	import ThickArrowUp from 'svelte-radix/ThickArrowUp.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	export let data;

	let search = data.search;
</script>

<div class="h-svh px-6 py-6 flex justify-center">
	<div class="max-w-3xl w-full">
		<form on:submit|preventDefault={() => {}}>
			<search
				class="flex w-full place-items-center rounded-lg border border-input pr-2
                text-foreground shadow-sm transition-all focus-within:ring-1 focus-within:ring-ring"
			>
				<input
					bind:value={search}
					type="text"
					placeholder="Search..."
					class="w-full min-w-0 border-0 bg-transparent px-2 py-2 outline-none
                     placeholder:text-muted-foreground focus:outline-none"
				/>
				<ArrowRight class="h-[1.2rem] w-[1.2rem]" />
			</search>
		</form>
		{#if data.polls.length == 0}
			<div class="flex flex-col place-items-center justify-center gap-2 py-10">
				<h2 class="text-3xl font-bold">You're not alone</h2>
				<p class="text-muted-foreground">But no one has thought of this yet...</p>
				{#if search.trim() != ''}
					<Button href="/polls/new?title={encodeURIComponent(search)}">Create</Button>
				{/if}
			</div>
		{:else}
			<div class="grid grid-cols-2 gap-2 py-4 sm:grid-cols-3 lg:grid-cols-4">
				{#each data.polls as poll}
					<a href="/polls/{poll.id}">
						<Card.Root class="flex flex-col gap-1 p-4">
							<Card.Title>
								{poll.content}
							</Card.Title>
							<Card.Content class="p-0">
								<span
									class="flex place-items-center gap-1 font-serif text-sm text-muted-foreground"
								>
									<ThickArrowUp class="size-4" />
									{poll.upvotes}
								</span>
							</Card.Content>
						</Card.Root>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
