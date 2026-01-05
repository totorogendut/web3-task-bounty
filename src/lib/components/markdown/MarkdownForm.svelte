<script lang="ts">
	import { onMount } from "svelte";
	import CommentFormToolbar from "./MarkdownFormToolbar.svelte";
	import { Bold, Italic, Code, Link } from "@lucide/svelte";
	import { MarkdownFormState } from "./index.svelte";

	interface Props {
		name?: string;
		placeholder?: string;
		canSubmit?: boolean;
		class?: string;
		content?: string;
		onSubmit?: (content: string) => void;
	}

	const mdState = new MarkdownFormState();
	const isSubmitDisabled = $derived(!mdState?.content?.length);
	let {
		name,
		content = "",
		canSubmit = true,
		class: className = "",
		placeholder = "Write your comment...",
		onSubmit,
	}: Props = $props();

	function submit(): void {
		mdState.submitted = mdState.content;
		onSubmit?.(mdState.content);
	}

	onMount(() => {
		mdState.content = content;
	});
</script>

<div
	class="group/comment mx-auto w-full
	rounded-md bg-slate-900 shadow-2xl
	transition has-focus:-translate-y-1 {className}"
>
	<div
		class="flex gap-2 border-t-4 border-cyan-500
	bg-slate-700
	 px-4 pt-6 pb-2 group-has-focus/comment:border-transparent"
	>
		<CommentFormToolbar {mdState} type="bold"><Bold size="18" /></CommentFormToolbar>
		<CommentFormToolbar {mdState} type="italic"><Italic size="18" /></CommentFormToolbar>
		<CommentFormToolbar {mdState} type="code"><Code size="18" /></CommentFormToolbar>
		<CommentFormToolbar {mdState} type="link"><Link size="18" /></CommentFormToolbar>
		<small class="ml-auto self-center text-white/70">Markdown</small>
	</div>

	<!-- Editor -->
	<textarea
		bind:this={mdState.textareaEl}
		bind:value={mdState.content}
		class="m2 min-h-55 w-full resize-y
		border-0 bg-slate-950 p-4 font-mono text-sm
		 text-slate-100 outline-none focus:ring-5
		 focus:ring-sky-500"
		{placeholder}
		{name}
	></textarea>

	<!-- Actions -->
	{#if canSubmit}
		<div class="flex justify-end border-t border-slate-800 px-6 py-4">
			<button
				disabled={isSubmitDisabled}
				onclick={submit}
				class="rounded-md from-sky-500 to-indigo-600 px-5 py-2 font-semibold text-slate-100/85 transition not-disabled:cursor-pointer
					not-disabled:bg-linear-to-r not-disabled:hover:brightness-110 disabled:bg-sky-500 disabled:grayscale-25 disabled:saturate-70"
			>
				Submit
			</button>
		</div>
	{/if}
</div>
