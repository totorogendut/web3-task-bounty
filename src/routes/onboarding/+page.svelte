<script lang="ts">
</script>

<form
	method="post"
	class="mx-auto mt-50 flex w-100 flex-col
 gap-4 rounded-md bg-amber-200 p-4"
>
	<input type="file" name="avatar" />
	<label class="flex flex-col gap-2">
		<strong> Username </strong>
		<input type="text" name="username" />
	</label>

	<button
		class="w-full cursor-pointer rounded-md bg-sky-300
    p-2 hover:brightness-90"
		type="submit">I'm ready!</button
	>
</form>
