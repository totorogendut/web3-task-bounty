<script lang="ts">
	import { PencilLine } from "@lucide/svelte";
	import MarkdownForm from "../markdown/MarkdownForm.svelte";
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
