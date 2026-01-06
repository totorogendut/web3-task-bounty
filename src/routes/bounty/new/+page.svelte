<script lang="ts">
	import { enhance } from "$app/forms";
	import DeadlinePicker from "$lib/components/DeadlinePicker.svelte";
	import Dropdown from "$lib/components/Dropdown.svelte";
	import MarkdownForm from "$lib/components/markdown/MarkdownForm.svelte";
	import ModalDialog from "$lib/components/ModalDialog.svelte";
	import SkillDropdown from "$lib/components/skills/SkillDropdown.svelte";
	import TextArea from "$lib/components/TextArea.svelte";
	import TextInput from "$lib/components/TextInput.svelte";

	let currency: string;
	let openModal = $state(false);
	let formEl: HTMLFormElement;

	const { form } = $props();
</script>

<form use:enhance bind:this={formEl} class="mx-auto mt-50 flex w-250 flex-col gap-4" method="post">
	{#if form?.error}
		<div class="w-full rounded-md bg-red-800 p-4 text-white/90">
			Error {form.error}
		</div>
	{/if}
	<h1 class=" cowboy-text text-5xl">Write a new bounty</h1>
	<TextInput placeholder="The title of your bounty" label="Title" name="title" autocomplete="off" />
	<TextArea
		placeholder="Short description to show when people search for bounties"
		label="Description"
		name="description"
		autocomplete="off"
	/>
	<MarkdownForm
		class="mt-4"
		name="content"
		placeholder="Write what's your bounty is about"
		canSubmit={false}
	/>
	<div class="flex items-center gap-4">
		<DeadlinePicker />
		<TextInput label="Reward" type="number" placeholder="$0.00" name="rewardAmount" />
		<Dropdown
			bind:value={currency}
			label="Currency"
			name="rewardCurrency"
			options={["MNEE", "ETH", "USD"]}
		/>
	</div>

	<div class="cta gap2 flex items-start justify-between">
		<small class="w-120">
			*Posting bounty will run a small contract for a gas fee on top of putting ER20 based crypto
			over the smart contract. You might need to incur additional gas fee for further interactions
			with the smart contract like releasing funds or set a winning bid for the bounty.
		</small>
		<button
			class="shadow-2l cursor-pointer rounded-md bg-amber-700 px-4 py-2
			font-bold hover:-translate-y-0.5 hover:bg-amber-600 active:translate-y-0"
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
	<ModalDialog onClose={() => (openModal = false)} onYes={() => formEl.submit()}>
		Bidding for bounty. Are you sure?
	</ModalDialog>
{/if}
