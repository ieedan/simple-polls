<script lang="ts">
	import LightSwitch from '$lib/components/ui/light-switch/light-switch.svelte';
	import '@fontsource/geist-sans';
	import '@fontsource/geist-mono';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import Button from '$lib/components/ui/button/button.svelte';
	import { SignIn } from '@auth/sveltekit/components';
	import { page } from '$app/stores';
</script>

<ModeWatcher />
<main class="min-h-svh">
	<slot />
</main>
<footer class="flex max-w-7xl justify-end gap-2 border-t border-border px-6 py-4">
	{#if !$page.data.session}
		<SignIn>
			<Button slot="submitButton">Login</Button>
		</SignIn>
	{/if}

	<LightSwitch />
</footer>
