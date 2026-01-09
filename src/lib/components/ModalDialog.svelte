<script lang="ts">
	import type { Snippet } from "svelte";
	import { cubicIn, cubicOut } from "svelte/easing";
	import { fade, fly } from "svelte/transition";

	interface Props {
		children?: Snippet;
		onClose: () => void;
		onYes?: () => void;
		onCancel?: () => void;
		hasOptions?: boolean;
		width?: number;
	}

	let { children, onClose, onYes, onCancel, hasOptions = true, width = 400 }: Props = $props();
</script>

<dialog
	open
	style="width:{width}px;"
	class="fixed inset-0 top-[15%] isolate z-50 mx-auto bg-transparent"
>
	<button
		in:fade={{ duration: 126 }}
		out:fade={{ duration: 65 }}
		onclick={onClose}
		aria-label="overlay"
		class="fixed top-0 left-0 h-screen w-full bg-black/20
						 backdrop-blur-2xl"
		type="submit"
	></button>
	<div
		in:fly={{ y: 12, duration: 325, easing: cubicOut }}
		out:fly={{ y: 12, duration: 125, easing: cubicIn }}
		class="relative z-10 rounded-md bg-white p-4"
	>
		{@render children?.()}
		{#if hasOptions}
			<div class="mt-8 flex justify-end gap-2">
				<button
					type="button"
					class="cursor-pointer rounded-md bg-red-200
						 px-4 py-1 font-semibold hover:bg-red-300"
					onclick={() => {
						onClose();
						onCancel?.();
					}}>Cancel</button
				>
				<button
					type="button"
					class="cursor-pointer rounded-md bg-green-200
						 px-4 py-1 font-semibold hover:bg-green-300"
					onclick={() => {
						onClose();
						onYes?.();
					}}>Yes</button
				>
			</div>
		{/if}
	</div>
</dialog>
