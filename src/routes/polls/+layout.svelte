<script lang="ts">
	import { page } from '$app/stores';

	export let data;
</script>

<header class="border-b border-border px-8 py-4">
	<div class="flex max-w-7xl place-items-center">
		<div class="flex place-items-center gap-8">
			<a href="/" class="font-bold text-lg"> Simple Polls </a>
			<nav class="flex place-items-center gap-6">
				<a
					href="/polls"
					class="text-muted-foreground data-[active=true]:text-primary"
					data-active={$page.url.pathname == '/polls'}
				>
					Polls
				</a>
				{#if data.session}
					<a
						href="/polls/my-polls"
						class="text-muted-foreground data-[active=true]:text-primary"
						data-active={$page.url.pathname == '/polls/my-polls'}
					>
						My Polls
					</a>
					<a
						href="/polls/participating"
						class="text-muted-foreground data-[active=true]:text-primary"
						data-active={$page.url.pathname == '/polls/participating'}
					>
						Participating
					</a>
				{/if}
			</nav>
		</div>
	</div>
</header>
<slot />
