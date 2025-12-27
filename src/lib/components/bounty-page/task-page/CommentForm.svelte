<script lang="ts">
	import { onMount } from "svelte";
	import { comment } from "./comment.svelte";
	import CommentFormToolbar from "./CommentFormToolbar.svelte";
	import { Bold, Italic, Code, Link } from "@lucide/svelte";

	const isSubmitDisabled = $derived(!comment?.content?.length);

	function submit(): void {
		comment.submitted = comment.content;
	}

	onMount(() => {
		comment.reset();
	});
</script>

<div
	class="group/comment mx-auto mt-10 max-w-3xl
	rounded-md bg-slate-900 shadow-2xl
	transition has-focus:-translate-y-1"
>
	<div
		class="flex gap-2 border-t-4 border-cyan-500
	bg-slate-700
	 px-4 pt-6 pb-2 group-has-focus/comment:border-transparent"
	>
		<CommentFormToolbar type="bold"><Bold size="18" /></CommentFormToolbar>
		<CommentFormToolbar type="italic"><Italic size="18" /></CommentFormToolbar>
		<CommentFormToolbar type="code"><Code size="18" /></CommentFormToolbar>
		<CommentFormToolbar type="link"><Link size="18" /></CommentFormToolbar>
		<small class="ml-auto self-center text-white/70">Markdown</small>
	</div>

	<!-- Editor -->
	<textarea
		bind:this={comment.textareaEl}
		bind:value={comment.content}
		class="m2 min-h-55 w-full resize-y
		border-0 bg-slate-950 p-4 font-mono text-sm text-slate-100 outline-none focus:ring-5 focus:ring-sky-500"
		placeholder="Write your markdown here..."
	></textarea>

	<!-- Actions -->
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
</div>
