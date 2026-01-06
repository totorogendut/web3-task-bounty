<script lang="ts">
	import { format } from "date-fns";
	import { SvelteDate } from "svelte/reactivity";
	import { DatePicker } from "@svelte-plugins/datepicker";
	import TextInput from "./TextInput.svelte";

	let deadline = $state(30);
</script>

<TextInput
	label="Deadline (in days)"
	type="number"
	placeholder="Select date"
	bind:value={deadline}
	name="deadline"
/>
