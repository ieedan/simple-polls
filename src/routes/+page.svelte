<script lang="ts">
	import ArrowRight from 'svelte-radix/ArrowRight.svelte';
</script>

<section class="flex h-svh flex-col place-items-center justify-center gap-4">
	<h1 class="text-center text-5xl font-bold sm:text-7xl">You're not alone</h1>
	<p class="text-center text-muted-foreground sm:text-lg">Find out just how not alone you are.</p>
	<search
		class="flex place-items-center rounded-lg border border-input transition-all focus-within:border-ring text-foreground pr-2"
	>
		<input
			type="text"
			placeholder="Search..."
			class="border-0 bg-transparent px-2 py-2 outline-none placeholder:text-muted-foreground focus:outline-none"
		/>
		<ArrowRight
			class="h-[1.2rem] w-[1.2rem]"
		/>
	</search>
</section>
