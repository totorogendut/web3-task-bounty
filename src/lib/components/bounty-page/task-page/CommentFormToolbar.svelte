<script lang="ts">
	import { tick, type Snippet } from "svelte";
	import { comment } from "./comment.svelte";

	type FormatType = "bold" | "italic" | "code" | "link";

	interface Props {
		type: FormatType;
		children?: Snippet;
	}

	const { type, children }: Props = $props();

	let buttonEl: HTMLButtonElement;
	let index = $state(0);

	function wrap(before: string, after: string = before): void {
		const { selectionStart, selectionEnd, value } = comment.textareaEl!;
		const hasSelection = selectionStart !== selectionEnd;

		const selected = value.slice(selectionStart, selectionEnd);

		comment.content =
			value.slice(0, selectionStart) + before + selected + after + value.slice(selectionEnd);

		// Calculate cursor position
		const cursorPos = hasSelection
			? selectionStart + before.length + selected.length + after.length
			: selectionStart + before.length;

		// Wait for DOM update, then restore cursor
		tick().then(() => {
			comment.textareaEl?.focus();
			comment.textareaEl?.setSelectionRange(cursorPos, cursorPos);
		});
	}

	function onFormat(type: FormatType): void {
		if (type === "bold") wrap("**");
		if (type === "italic") wrap("*");
		if (type === "code") wrap("`");
		if (type === "link") wrap("[", "](url)");
	}

	$effect(() => {
		if (!buttonEl.parentElement) return;
		index = Array.from(buttonEl.parentElement.children).indexOf(buttonEl);
	});
</script>

<button
	bind:this={buttonEl}
	style="--transition-delay: {65 * (index + 1)}ms;"
	class="cursor-pointer rounded-md bg-slate-900 px-2
    py-1 text-sm font-semibold
    text-slate-200 transition-transform
    delay-(--transition-delay)
    group-has-focus/comment:-translate-y-1 hover:bg-sky-300 hover:text-sky-900
		active:brightness-110"
	onclick={(e) => onFormat(type)}
>
	{@render children?.()}
</button>
