<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/state";
	import { tokens } from "$lib/_eth-shared.js";
	import DeadlinePicker from "$lib/components/DeadlinePicker.svelte";
	import Dropdown from "$lib/components/Dropdown.svelte";
	import MarkdownForm from "$lib/components/markdown/MarkdownForm.svelte";
	import ModalDialog from "$lib/components/ModalDialog.svelte";
	import TextArea from "$lib/components/TextArea.svelte";
	import TextInput from "$lib/components/TextInput.svelte";
	import { createBounty } from "$lib/contracts.svelte.js";
	import { bountySchemas } from "$lib/schemas.js";
	import { daysAfter } from "$lib/utils/date.js";
	import { wallet } from "$lib/wallet.svelte.js";
	import { nanoid } from "nanoid";

	let openModal = $state(false);
	let formEl: HTMLFormElement;

	const { form } = $props();

	const input = $state({
		title: "",
		description: "",
		content: "",
		deadline: 0,
		reward: 0,
		currency: "mnee",
	});

	const isValid = $derived(bountySchemas.safeParse(input).success);

	async function submit() {
		const formData = new FormData(formEl);
		const id = nanoid(21);
		const txHash = await createBounty({
			bountyId: id,
			reward: input.reward.toPrecision(),
			deadline: daysAfter(input.deadline),
		});
		formData.append("id", id);
		formData.append("txHash", txHash);
		formEl.submit();
	}

	$inspect(wallet.client);
</script>

<form use:enhance bind:this={formEl} class="mx-auto mt-50 flex w-250 flex-col gap-4" method="post">
	{#if form?.error}
		<div class="w-full rounded-md bg-red-800 p-4 text-white/90">
			Error {form.error}
		</div>
	{/if}
	<h1 class=" cowboy-text text-5xl">Write a new bounty</h1>
	<TextInput
		bind:value={input.title}
		placeholder="The title of your bounty"
		label="Title"
		name="title"
		autocomplete="off"
	/>
	<TextArea
		bind:value={input.description}
		placeholder="Short description to show when people search for bounties"
		label="Description"
		name="description"
		autocomplete="off"
	/>
	<MarkdownForm
		bind:value={input.content}
		class="mt-4"
		name="content"
		placeholder="Write the instruction and details of your bounty"
		canSubmit={false}
	/>
	<div class="flex items-center gap-4">
		<DeadlinePicker bind:value={input.deadline} />
		<TextInput
			bind:value={input.reward}
			label="Reward"
			type="number"
			placeholder="$0.00"
			name="rewardAmount"
		/>
		<Dropdown
			bind:value={input.currency}
			label="Currency"
			name="rewardCurrency"
			options={Object.keys(tokens.mainnet)}
		/>
	</div>

	<div class="cta gap2 flex items-start justify-between">
		<small class="w-120">
			*Posting bounty will run a small contract for a gas fee on top of putting ER20 based crypto
			over the smart contract. You might need to incur additional gas fee for further interactions
			with the smart contract like releasing funds or set a winning bid for the bounty.
		</small>
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
			Post bounty
		</button>
	</div>
</form>

{#if openModal}
	<ModalDialog onClose={() => (openModal = false)} onYes={() => submit()}>
		Bidding for bounty. Are you sure?
	</ModalDialog>
{/if}
