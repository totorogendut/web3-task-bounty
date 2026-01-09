<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import { tokens } from "$lib/_eth-shared.js";
	import Button from "$lib/components/Button.svelte";
	import DeadlinePicker from "$lib/components/DeadlinePicker.svelte";
	import Dropdown from "$lib/components/Dropdown.svelte";
	import MarkdownForm from "$lib/components/markdown/MarkdownForm.svelte";
	import ModalDialog from "$lib/components/ModalDialog.svelte";
	import TextArea from "$lib/components/TextArea.svelte";
	import TextInput from "$lib/components/TextInput.svelte";
	import { bountySchemas } from "$lib/schemas.js";

	let openModal = $state(false);
	let formEl: HTMLFormElement;

	const { form } = $props();

	const input = $state({
		title: "",
		description: "",
		content: "",
		deadline: 0,
		rewardAmount: 0,
		currency: "mnee",
	});

	const schemaParse = $derived(bountySchemas.safeParse(input));
	const isValid = $derived(schemaParse.success);
	const schemaErrors = $derived(schemaParse.error?.issues);
</script>

<form use:enhance bind:this={formEl} class="mx-auto mt-50 flex w-250 flex-col gap-4" method="post">
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
		<TextInput
			label="Deadline (in days)"
			type="number"
			placeholder="Select date"
			bind:value={input.deadline}
			name="deadline"
		/>
		<TextInput
			bind:value={input.rewardAmount}
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
			{#if schemaErrors?.length}
				<div class="mt-4 text-red-300">
					<strong>Can't post yet</strong>
					<div class="flex flex-col leading-[1.2]">
						{#each schemaErrors as error}
							<span>> {error.message}</span>
						{/each}
					</div>
				</div>
			{/if}
		</small>
		<Button
			type="button"
			disabled={!isValid}
			onclick={(e) => {
				console.log(e);
				openModal = true;
			}}
		>
			Post bounty
		</Button>
	</div>
</form>

{#if openModal}
	<ModalDialog onClose={() => (openModal = false)} onYes={() => formEl.submit()}>
		Create a bounty. Are you sure?
	</ModalDialog>
{/if}
