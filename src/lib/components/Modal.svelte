<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		children?: Snippet;
		onClose: () => void;
	}

	// let open = $state(false);

	let { children, onClose }: Props = $props();
</script>

<div class="relative z-50">
	<button
		onclick={onClose}
		class="fixed top-0 left-0 h-screen w-full bg-black/20
			backdrop-blur-2xl"
		type="submit"
	></button>
	<dialog open class="fixed inset-0 top-[15%] mx-auto w-150 bg-transparent">
		{@render children?.()}
	</dialog>
</div>
