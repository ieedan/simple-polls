<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { ArrowRight, ThickArrowDown } from 'svelte-radix';
	import ThickArrowUp from 'svelte-radix/ThickArrowUp.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { scale } from 'svelte/transition';

	export let data;

	let search = data.search;
</script>

<div class="px-6 py-6 flex justify-center">
	<div class="max-w-3xl w-full">
		<h1 class="text-4xl font-bold pb-4 text-center">Polls</h1>
		<form>
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
				<div class="size-5">
					{#if search.trim() != ''}
						<div transition:scale={{ duration: 150, start: 0.5 }}>
							<ArrowRight class="size-5" />
						</div>
					{/if}
				</div>
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
			<div class="flex flex-col gap-2 py-4">
				{#each data.polls as poll}
					<a href="/polls/{poll.id}">
						<Card.Root class="flex flex-col gap-1 p-4">
							<Card.Title>
								{poll.content}
							</Card.Title>
							<Card.Content class="p-0">
								<div class="flex place-items-center gap-2">
									<span
										class="flex place-items-center gap-1 font-serif text-sm text-muted-foreground"
									>
										<ThickArrowUp class="size-4" />
										{poll.upvotes}
									</span>
									<span
										class="flex place-items-center gap-1 font-serif text-sm text-muted-foreground"
									>
										<ThickArrowDown class="size-4" />
										{poll.downvotes}
									</span>
								</div>
							</Card.Content>
						</Card.Root>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
