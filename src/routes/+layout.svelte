<script lang="ts">
	import LightSwitch from '$lib/components/ui/light-switch/light-switch.svelte';
	import '@fontsource/geist-sans';
	import '@fontsource/geist-mono';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import Button from '$lib/components/ui/button/button.svelte';
	import { SignOut } from '@auth/sveltekit/components';
	import { page } from '$app/stores';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { GithubLogo } from 'svelte-radix';
</script>

<ModeWatcher />
<main class="min-h-svh">
	<slot />
</main>
<footer class="flex place-items-center justify-center border-t border-border">
	<div class="flex w-full max-w-7xl place-items-center justify-end gap-4 px-8 py-4">
		{#if $page.data.session}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Avatar.Root class="size-7">
						<Avatar.Image
							src={$page.data.session.user?.image}
							alt="{$page.data.session.user?.name}'s user picture"
						/>
						<Avatar.Fallback>
							{$page.data.session.user?.name ? $page.data.session.user?.name[0] : ''}
						</Avatar.Fallback>
					</Avatar.Root>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content sideOffset={5}>
					<DropdownMenu.Group>
						<DropdownMenu.Item href="/polls/my-polls" class="hover:cursor-pointer">
							My Polls
						</DropdownMenu.Item>
						<DropdownMenu.Item href="/polls/participating" class="hover:cursor-pointer">
							Participating
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>
							<SignOut>
								<span slot="submitButton">Logout</span>
							</SignOut>
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{:else if $page.url.pathname != '/signin'}
			<Button href="/signin?redirectTo={encodeURIComponent($page.url.pathname + $page.url.search)}">
				Login
			</Button>
		{/if}
		<div class="flex place-items-center gap-2">
			<Button
				variant="outline"
				size="icon"
				target="_blank"
				href="https://github.com/ieedan/simple-polls"
			>
				<GithubLogo class="size-5" />
			</Button>

			<LightSwitch />
		</div>
	</div>
</footer>
