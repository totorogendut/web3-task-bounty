<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import DeadlinePicker from "$lib/components/DeadlinePicker.svelte";
	import MarkdownForm from "$lib/components/markdown/MarkdownForm.svelte";
	import TextArea from "$lib/components/TextArea.svelte";
	import TextInput from "$lib/components/TextInput.svelte";

	const { data, form } = $props();

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

	<div class="cta gap2 mt-4 flex justify-end">
		<button class="rounded-md bg-amber-700 px-4 py-2" type="submit"> Claim bounty </button>
	</div>
</form>
