<script lang="ts">
	import { page } from '$app/stores';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
    import Slash from "svelte-radix/Slash.svelte";

	/** Can be used to exclude a path prefix EX: excludePrefix == '/dashboard' => route == '/dashboard/settings' => route == '/settings'*/
	export let excludePrefix: string | undefined = undefined;
	/** Allows you to apply a custom transform to the path name */
	export let transform: (pathName: string) => string = (pathName: string) => pathName;
	/** Will prevent the transformation from being run on direct children of the routes provided*/
	export let doNotTransform: string[] = [];

	type BreadCrumb = {
		name: string;
		href: string;
	};

	$: breadCrumbs = getBreadCrumbs($page.url.pathname);

	const getBreadCrumbs = (path: string): BreadCrumb[] => {
		let p = path;
		if (excludePrefix) {
			if (excludePrefix.endsWith('/')) {
				excludePrefix = excludePrefix.slice(0, excludePrefix.length - 1);
			}

			p = p.replace(excludePrefix, '');
		}

		const routes = p.split('/');

		let currentPath = excludePrefix != undefined ? excludePrefix : '';
		const bcs: BreadCrumb[] = [];
		let lastBCIndex = 0;
		for (let i = 0; i < routes.length; i++) {
			const noTransform =
				bcs[lastBCIndex] &&
				doNotTransform &&
				doNotTransform.find((a) => bcs[lastBCIndex].href.endsWith(a));

			if (routes[i] == '') {
				if (i == routes.length - 1 && bcs[lastBCIndex] != undefined) {
					bcs[lastBCIndex].href = bcs[lastBCIndex].href + '/';
				}
				continue;
			}
			currentPath = currentPath + '/' + routes[i];
			bcs.push({
				name: noTransform ? decodeURIComponent(routes[i]) : transform(routes[i]),
				href: currentPath
			});
			lastBCIndex = bcs.length - 1;
		}

		return bcs;
	};
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		{#each breadCrumbs as { name, href }}
			<Breadcrumb.Item>
				<Breadcrumb.Link {href}>{name}</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator >
                <Slash tabindex="-1" />
            </Breadcrumb.Separator>
		{/each}
	</Breadcrumb.List>
</Breadcrumb.Root>
