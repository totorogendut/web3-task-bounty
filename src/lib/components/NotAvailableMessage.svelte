<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	interface Props extends HTMLAttributes<HTMLDivElement> {
		title?: string;
		children?: Snippet;
	}

	const { title = "Unavailable", class: className, children, ...data }: Props = $props();
</script>

<div
	class={[
		`mx-auto my-20 flex flex-col items-center
  justify-center gap-3`,
		className,
	]}
>
	<div>
		<img width="300" src="/surrender.webp" alt={title} />
		<div class="h-1 w-full bg-amber-700"></div>
	</div>
	<strong class="mt-4 cowboy-text text-4xl">{title}</strong>
	<div class="w-100 text-center text-lg leading-5">
		{@render children?.()}
	</div>
</div>
