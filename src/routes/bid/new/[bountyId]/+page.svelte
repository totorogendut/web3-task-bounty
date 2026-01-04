<script lang="ts">
	import DeadlinePicker from "$lib/components/DeadlinePicker.svelte";
	import MarkdownForm from "$lib/components/markdown/MarkdownForm.svelte";
	import TextArea from "$lib/components/TextArea.svelte";
	import TextInput from "$lib/components/TextInput.svelte";
</script>

<form class="mx-auto mt-50 flex w-250 flex-col gap-4" method="post">
	<h1 class=" cowboy-text text-5xl">Hunt this bounty</h1>
	<MarkdownForm
		class="mt-4"
		name="content"
		placeholder="Try to convice the client why you should the one who claim the reward"
		canSubmit={false}
	/>

	<div class="cta gap2 mt-4 flex justify-end">
		<button class="rounded-md bg-amber-700 px-4 py-2" type="submit"> Claim bounty </button>
	</div>
</form>
