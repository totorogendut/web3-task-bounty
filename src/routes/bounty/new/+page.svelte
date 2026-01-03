<script lang="ts">
	import DeadlinePicker from "$lib/components/DeadlinePicker.svelte";
	import MarkdownForm from "$lib/components/markdown/MarkdownForm.svelte";
	import SkillDropdown from "$lib/components/skills/SkillDropdown.svelte";
	import TextArea from "$lib/components/TextArea.svelte";
	import TextInput from "$lib/components/TextInput.svelte";
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
		<DeadlinePicker />
		<TextInput label="Reward" type="number" placeholder="$0.00" name="rewardAmount" />
	</div>
	<!-- <SkillDropdown /> -->

	<div class="cta gap2 mt-4 flex justify-end">
		<button class="rounded-md bg-amber-700 px-4 py-2" type="submit"> Post bounty </button>
	</div>
</form>
