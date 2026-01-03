<script lang="ts">
	import MarkdownForm from "$lib/components/markdown/MarkdownForm.svelte";
	import TextArea from "$lib/components/TextArea.svelte";
	import TextInput from "$lib/components/TextInput.svelte";
	import { DatePicker } from "@svelte-plugins/datepicker";
	import { format } from "date-fns";

	let dateFormat = "MM/dd/yy";
	let startDate = $state(new Date());
	let isOpen = $state(false);
	const formatDate = (dateString: string) => {
		if (isNaN(new Date(dateString))) {
			return "";
		}

		return (dateString && format(new Date(dateString), dateFormat)) || "";
	};

	const toggleDatePicker = () => (isOpen = !isOpen);
	let formattedStartDate = $state(formatDate(startDate));

	const onChange = () => {
		startDate = new Date(formattedStartDate);
	};
</script>

<form class="mx-auto mt-50 flex w-250 flex-col gap-4" method="post">
	<h1 class=" cowboy-text text-5xl">Write a new bounty</h1>
	<TextInput label="Title" name="title" autocomplete="off" />
	<TextArea label="Description" name="description" autocomplete="off" />
	<MarkdownForm
		class="mt-4"
		name="content"
		placeholder="Write what's your bounty is about"
		canSubmit={false}
	/>
	<div class="flex items-center gap-4">
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

		<div>
			<TextInput label="Reward" type="number" placeholder="$0.00" name="rewardAmount" />
		</div>
	</div>

	<div class="cta gap2 mt-4 flex justify-end">
		<button class="rounded-md bg-amber-700 px-4 py-2" type="submit"> Post bounty </button>
	</div>
</form>
