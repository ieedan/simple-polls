<script lang="ts">
	import { providerMap } from '$lib/auth/providers';
	import { SignIn } from '@auth/sveltekit/components';
	import { GithubLogo } from 'svelte-radix';
</script>

<div class="flex h-svh place-items-center justify-center">
	<div class="flex flex-col gap-2 w-full max-w-[250px] sm:max-w-[300px]">
		<h1 class="text-center font-bold text-2xl">Log in to Not Alone</h1>
		<section class="h-2"></section>
		{#each providerMap as provider}
			<SignIn provider={provider.id} signInPage="signin" className="w-full">
				<div slot="submitButton" class="w-[250px] sm:w-[300px] justify-center bg-secondary/80 text-secondary-foreground hover:bg-secondary px-6 py-3 rounded-lg flex place-items-center gap-4">
					{#if provider.name == 'GitHub'}
						<GithubLogo class="size-5"/>
					{/if}
					Continue with {provider.name}
				</div>
			</SignIn>
		{/each}
	</div>
</div>
