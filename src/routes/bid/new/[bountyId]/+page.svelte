<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import DeadlinePicker from "$lib/components/DeadlinePicker.svelte";
	import MarkdownForm from "$lib/components/markdown/MarkdownForm.svelte";
	import TextArea from "$lib/components/TextArea.svelte";
	import TextInput from "$lib/components/TextInput.svelte";
	import prettyBytes from "pretty-bytes";

	const { data, form } = $props();
	let files: FileList | undefined = $state();
	let fileNames = $derived.by(() => {
		const names = [];
		if (!files) return [];
		for (const file of files) {
			names.push(file.name);
		}
		return names;
	});

	$inspect({ files, fileNames });

	$effect(() => {
		if (form?.id) goto(`/bid/${form.id}`);
	});
</script>

<form use:enhance class="mx-auto mt-50 flex w-250 flex-col gap-4" method="post">
	{#if form?.error}
		<div class="w-full rounded-md bg-red-800 p-4 text-white/90">
			Error {form.error}
		</div>
	{/if}

	<h1 class=" cowboy-text text-5xl">Hunt this bounty</h1>
	<MarkdownForm
		class="mt-4"
		name="content"
		placeholder="Try to convice the client why you should the one who claim the reward"
		canSubmit={false}
	/>

	<div class="cta gap2 mt-4 flex items-end justify-between">
		<div>
			<label class="flex flex-col gap-2 font-semibold">
				Attachment
				<input
					bind:files
					class="font-medium text-white/80 file:mr-4 file:cursor-pointer
					file:rounded-md file:bg-amber-50 file:px-4 file:py-1 file:text-black"
					type="file"
					multiple
					name="attachment"
				/>
			</label>
		</div>
		<button
			class="shadow-2l cursor-pointer rounded-md bg-amber-700 px-4 py-2
			font-bold hover:-translate-y-0.5 hover:bg-amber-600 active:translate-y-0"
			type="submit"
		>
			Post bounty
		</button>
	</div>
	<div class="flex flex-col gap-2">
		{#each files as file}
			<div class="flex items-center gap-3 leading-none">
				<strong>{file.name}</strong>
				<small class="translate-y-0.5">({prettyBytes(file.size)})</small>
			</div>
		{/each}
	</div>
</form>
