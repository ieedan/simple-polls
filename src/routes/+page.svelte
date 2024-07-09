<script lang="ts">
	import ArrowRight from 'svelte-radix/ArrowRight.svelte';
	import * as Card from '$lib/components/ui/card';
	import ThickArrowUp from 'svelte-radix/ThickArrowUp.svelte';
	import { goto } from '$app/navigation';
	import { scale } from 'svelte/transition';

	export let data;

	let search = '';
</script>

<section class="flex flex-col place-items-center justify-center gap-4 px-6 pt-60">
	<h1 class="text-center text-5xl font-bold sm:text-7xl">You're not alone</h1>
	<p class="text-center text-muted-foreground sm:text-lg">Find out just how not alone you are.</p>
	<form
		on:submit|preventDefault={() => {
			if (search.trim() != '') {
				goto(`/polls?search=${encodeURIComponent(search)}`);
			}
		}}
	>
		<search
			class="flex w-full max-w-[300px] place-items-center rounded-lg border border-input pr-2
		text-foreground shadow-sm transition-all focus-within:ring-1 focus-within:ring-ring sm:max-w-[400px]"
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
</section>
{#if data.polls.length > 0}
	<section class="px-6 pt-8">
		<div class="flex flex-col place-items-center justify-center gap-2">
			<h3 class="text-center">Recent Popular Polls</h3>
			<div class="grid max-w-[608px] grid-cols-1 gap-2 sm:grid-cols-2">
				{#each data.polls as poll}
					<a href="/polls/{poll.id}">
						<Card.Root class="flex w-[300px] flex-col gap-1 p-4">
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
		</div>
	</section>
{/if}
