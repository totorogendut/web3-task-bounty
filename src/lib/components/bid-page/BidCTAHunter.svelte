<script lang="ts">
	import { editBid } from "$lib/api/bounty.remote";
	import { PencilLine } from "@lucide/svelte";

	import MarkdownForm from "../markdown/MarkdownForm.svelte";
	import { page } from "$app/state";
	import type { Bounty } from "$lib/server/db/schemas";
	import BidCTAButton from "./BidCTAButton.svelte";
	import Modal from "../Modal.svelte";

	interface Props {
		onEdit?: (content: string) => void;
		content: string;
	}

	let openEditModal = $state(false);

	const { content, onEdit }: Props = $props();
</script>

<BidCTAButton onclick={() => (openEditModal = true)}>
	<PencilLine size={20} />
</BidCTAButton>

{#if openEditModal}
	<Modal onClose={() => (openEditModal = false)}>
		<MarkdownForm
			onSubmit={(content) => {
				onEdit?.(content);
				openEditModal = false;
			}}
			{content}
		></MarkdownForm>
	</Modal>
{/if}
