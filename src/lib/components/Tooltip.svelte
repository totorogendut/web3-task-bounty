<script lang="ts">
	import * as Tooltip from "$lib/components/ui/tooltip/index";
	import type { Snippet } from "svelte";

	interface Props {
		label: string;
		children?: Snippet;
		delayDuration?: number;
		side?: "top" | "left" | "bottom" | "right";
	}

	const { label, children, delayDuration = 66, side = "bottom" }: Props = $props();
</script>

<Tooltip.Provider {delayDuration} disableHoverableContent={true}>
	<Tooltip.Root>
		<Tooltip.Trigger>
			{@render children?.()}
		</Tooltip.Trigger>
		<Tooltip.Content {side}>
			{label}
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
