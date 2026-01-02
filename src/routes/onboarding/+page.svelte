<script lang="ts">
	import { ArrowRight } from "@lucide/svelte";
	import { usernameSchema } from "./_shared";

	let username = $state("");
	const nameSchema = $derived(usernameSchema.safeParse(username));
	const isNameValid = $derived(nameSchema.success);
	const error = $derived.by(() => {
		try {
			//@ts-ignore
			const [{ message }] = JSON.parse(nameSchema.error || `[{ message: "" }]`);
			return message;
		} catch (error) {
			return "";
		}
	});
</script>

<form
	method="post"
	class="relative isolate mx-auto mt-80
	w-124 rounded-md bg-linear-to-br/oklch from-red-600/60 to-amber-700
	 p-4 backdrop-brightness-10"
>
	<h1 class="mb-8 text-4xl font-extrabold text-shadow-lg">Choose your nickname</h1>
	<img class="absolute -right-50 bottom-0 z-0 h-100 w-auto" src="/cat-cowboy.webp" alt="Cowboy" />
	<div class="relative z-10 flex w-100 flex-col gap-4">
		<!-- <input type="file" name="avatar" /> -->

		<label class="flex flex-col gap-2">
			<strong class="text-shadow-lg"> Username </strong>
			<input
				bind:value={username}
				class="border-2! border-amber-700! font-semibold text-amber-800
					 ring-0! outline-2! outline-white! placeholder:font-medium"
				placeholder="e.g. CatGunslingerX88"
				type="text"
				name="username"
				autocomplete="off"
			/>
		</label>

		<button
			disabled={!isNameValid}
			class="flex h-10 w-full items-center justify-center gap-4 rounded-md
				 bg-amber-300 p-2 leading-[1.1] font-extrabold
			text-black/90 backdrop-blur-md not-disabled:cursor-pointer
			not-disabled:hover:brightness-90 disabled:bg-amber-200/50 disabled:font-medium disabled:text-shadow-xs"
			type="submit"
			>{error ? `⚠️ ${error}` : "I'm ready!"}
			{#if isNameValid}
				<ArrowRight size={20} />
			{/if}
		</button>
	</div>
</form>
