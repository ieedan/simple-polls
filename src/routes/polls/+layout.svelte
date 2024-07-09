<script lang="ts">
	import { page } from '$app/stores';
</script>

<header class="border-b border-border px-8 py-4">
	<div class="flex max-w-7xl place-items-center">
		<div class="flex place-items-center gap-8">
			<a href="/" class="font-serif text-lg"> N/A </a>
			<nav class="flex place-items-center gap-6">
				<a
					href="/polls"
					class="text-muted-foreground data-[active=true]:text-primary"
					data-active={$page.url.pathname == '/polls'}
				>
					Polls
				</a>
			</nav>
		</div>
	</div>
</header>
<slot />
