<script lang="ts">
	// Svelte 5 + TypeScript
	let content = $state<string>("");
	let submitted = $state<string>("");
	const isSubmitDisabled = $derived(!content.length);

	function submit(): void {
		submitted = content;
	}

	function wrap(
		selectionStart: number,
		selectionEnd: number,
		before: string,
		after: string = before,
	): void {
		const text: string = content;
		const selected: string = text.slice(selectionStart, selectionEnd);

		content = text.slice(0, selectionStart) + before + selected + after + text.slice(selectionEnd);
	}

	type FormatType = "bold" | "italic" | "code" | "link";

	function onFormat(type: FormatType, textarea: HTMLTextAreaElement): void {
		const { selectionStart, selectionEnd } = textarea;

		if (type === "bold") wrap(selectionStart, selectionEnd, "**");
		if (type === "italic") wrap(selectionStart, selectionEnd, "*");
		if (type === "code") wrap(selectionStart, selectionEnd, "`");
		if (type === "link") wrap(selectionStart, selectionEnd, "[", "](url)");

		textarea.focus();
	}
</script>

<div class="mx-auto mt-10 max-w-3xl rounded-md bg-slate-900 shadow-xl">
	<div class="flex gap-2 border-t-4 border-cyan-500 bg-slate-700 px-4 py-2 pt-6">
		<button
			class="toolbar-btn"
			onclick={(e) =>
				onFormat(
					"bold",
					(e.currentTarget as HTMLElement).closest("div")!
						.nextElementSibling as HTMLTextAreaElement,
				)}>B</button
		>

		<button
			class="toolbar-btn italic"
			onclick={(e) =>
				onFormat(
					"italic",
					(e.currentTarget as HTMLElement).closest("div")!
						.nextElementSibling as HTMLTextAreaElement,
				)}>I</button
		>

		<button
			class="toolbar-btn"
			onclick={(e) =>
				onFormat(
					"code",
					(e.currentTarget as HTMLElement).closest("div")!
						.nextElementSibling as HTMLTextAreaElement,
				)}>{"</>"}</button
		>

		<button
			class="toolbar-btn"
			onclick={(e) =>
				onFormat(
					"link",
					(e.currentTarget as HTMLElement).closest("div")!
						.nextElementSibling as HTMLTextAreaElement,
				)}>🔗</button
		>
		<small class="ml-auto self-center text-white/70">Markdown</small>
	</div>

	<!-- Editor -->
	<textarea
		bind:value={content}
		class="m2 min-h-55 w-full resize-y
		border-0 bg-slate-950 p-4 font-mono text-sm text-slate-100 outline-none focus:ring-5 focus:ring-sky-500"
		placeholder="Write your markdown here..."
	/>

	<!-- Actions -->
	<div class="flex justify-end border-t border-slate-800 px-6 py-4">
		<button
			disabled={isSubmitDisabled}
			onclick={submit}
			class="rounded-md bg-linear-to-r from-sky-500 to-indigo-600 px-5 py-2 font-semibold text-slate-100/85
			 transition not-disabled:cursor-pointer not-disabled:hover:brightness-110 disabled:grayscale-25 disabled:saturate-70"
		>
			Submit
		</button>
	</div>
</div>

<style>
	@reference "tailwindcss";

	.toolbar-btn {
		@apply rounded-md bg-slate-800 px-3 py-1 text-sm font-semibold text-slate-200 transition hover:bg-slate-700;
	}

	.toolbar-btn.italic {
		font-style: italic;
	}
</style>
