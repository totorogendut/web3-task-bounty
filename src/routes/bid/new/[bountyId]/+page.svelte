<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import { getBountyEscrowData } from "$lib/components/bid-page/index.remote.js";
	import MarkdownForm from "$lib/components/markdown/MarkdownForm.svelte";
	import ModalDialog from "$lib/components/ModalDialog.svelte";
	import { signSubmission } from "$lib/contracts.svelte.js";
	import { bidSchemas } from "$lib/schemas.js";
	import { error } from "@sveltejs/kit";
	import prettyBytes from "pretty-bytes";

	const { data, form } = $props();

	if (!page.params.bountyId) throw error(404, "No bountyId found");
	const bountyId = page.params.bountyId!;

	let formEl: HTMLFormElement;
	let openModal = $state(false);

	const input = $state({
		content: "",
		files: null,
	});

	const isValid = $derived(
		bidSchemas.safeParse(input).success && (input.files as any)?.length >= 1,
	);

	$effect(() => {
		if (form?.id) goto(`/bounty/${bountyId}`);
	});
</script>

<form
	use:enhance
	enctype="multipart/form-data"
	bind:this={formEl}
	class="mx-auto mt-50 flex w-250 flex-col gap-4"
	method="post"
	onsubmit={async (e) => {
		e.preventDefault();

		if (!data.bounty?.escrowAddress) return;
		const formData = new FormData(event?.target as HTMLFormElement);

		const { signature, submittedAt } = await signSubmission({
			escrowAddress: data.bounty.escrowAddress,
			bountyId: bountyId,
		});
		formData.append("signature", signature);
		formData.append("submittedAt", submittedAt.toString());
		formEl.submit();
	}}
>
	{#if form?.error}
		<div class="w-full rounded-md bg-red-800 p-4 text-white/90">
			Error {form.error}
		</div>
	{/if}

	<h1 class=" cowboy-text text-5xl">Hunt this bounty</h1>
	<MarkdownForm
		class="mt-4"
		bind:value={input.content}
		name="content"
		placeholder="Try to convice the client why you should the one who claim the reward"
		canSubmit={false}
	/>

	<div class="cta gap2 mt-4 flex items-end justify-between">
		<div>
			<label class="flex flex-col gap-2 font-semibold">
				Attachment
				<input
					bind:files={input.files}
					class="font-medium text-white/80 file:mr-4 file:cursor-pointer
					file:rounded-md file:bg-amber-50 file:px-4 file:py-1 file:text-black"
					type="file"
					multiple
					name="attachment"
				/>
			</label>
		</div>
		<button
			type="button"
			disabled={!isValid}
			class="not-disabled-hover:-translate-y-0.5 not-disabled-hover:bg-amber-600 not-disabled-active:translate-y-0
				rounded-md bg-amber-700 px-4 py-2 font-bold shadow-lg
				not-disabled:cursor-pointer disabled:grayscale-75"
			onclick={(e) => {
				e.preventDefault();
				openModal = true;
			}}
		>
			Post bid
		</button>
	</div>
	<div class="flex flex-col gap-2">
		{#each input.files || [] as f}
			{@const file = f as File}
			<div class="flex items-center gap-3 leading-none">
				<strong>{file.name}</strong>
				<small class="translate-y-0.5">({prettyBytes(file.size)})</small>
			</div>
		{/each}
	</div>
</form>

{#if openModal}
	<ModalDialog onClose={() => (openModal = false)} onYes={() => formEl.submit()}>
		Bidding for bounty. Are you sure?
	</ModalDialog>
{/if}
