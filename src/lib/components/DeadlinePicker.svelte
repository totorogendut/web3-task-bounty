<script lang="ts">
	import { format } from "date-fns";
	import { SvelteDate } from "svelte/reactivity";
	import { DatePicker } from "@svelte-plugins/datepicker";
	import TextInput from "./TextInput.svelte";

	let dateFormat = "MM/dd/yy";
	let startDate = new SvelteDate();
	const formatter = new Intl.DateTimeFormat(undefined, {
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
	});
	let isOpen = $state(false);
	const formatDate = (dateString: string) => {
		if (isNaN(new Date(dateString) as any)) {
			return "";
		}

		return (dateString && format(new Date(dateString), dateFormat)) || "";
	};

	const toggleDatePicker = () => (isOpen = !isOpen);
	let formattedStartDate = $state(formatter.format(startDate));

	// const onChange = () => {
	// 	startDate = new Date(formattedStartDate);
	// };
</script>

<DatePicker bind:isOpen bind:startDate>
	<TextInput
		label="Deadline"
		type="text"
		placeholder="Select date"
		bind:value={formattedStartDate}
		onclick={toggleDatePicker}
		name="deadline"
	/>
</DatePicker>
