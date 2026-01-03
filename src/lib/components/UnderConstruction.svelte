<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	interface Props extends HTMLAttributes<HTMLDivElement> {
		alt?: string;
	}

	const { alt = "Under development", ...data }: Props = $props();
</script>

<div
	class={[
		`mx-auto my-20 flex flex-col items-center
  justify-center gap-3`,
		data.class,
	]}
>
	<div>
		<img width="300" src="/surrender.webp" {alt} />
		<div class="h-1 w-full bg-amber-700"></div>
	</div>
	<strong class="mt-4 cowboy-text text-4xl">Not available</strong>
	<div class="w-100 text-center text-lg leading-5">
		This is an advanced feature meant for beyond hackaton and currently not available in this demo.
	</div>
</div>
