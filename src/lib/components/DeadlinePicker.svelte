<script lang="ts">
	import TextInput from "./TextInput.svelte";

	interface Props {
		value: number;
	}

	let { value = $bindable() }: Props = $props();
</script>

<TextInput
	label="Deadline (in days)"
	type="number"
	placeholder="Select date"
	bind:value
	name="deadline"
/>
