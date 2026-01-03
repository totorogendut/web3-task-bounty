<script>
	import { X } from "@lucide/svelte";

	const { skill, onRemove } = $props();
</script>

<button
	onclick={() => onRemove(skill)}
	class="flex items-center gap-2 rounded-full
   bg-indigo-100 px-3 py-1 text-sm text-indigo-700
   transition hover:bg-indigo-200"
>
	{skill}
	<X />
</button>
