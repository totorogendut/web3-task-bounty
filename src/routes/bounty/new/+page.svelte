<script lang="ts">
	import TextArea from "$lib/components/TextArea.svelte";
	import TextInput from "$lib/components/TextInput.svelte";
</script>

<form method="post">
	<TextInput label="Title" name="title" />
	<TextArea label="Description" name="description" />
</form>
