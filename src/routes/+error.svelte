<script lang="ts">
	import { page } from "$app/state";
	import NotAvailableMessage from "$lib/components/NotAvailableMessage.svelte";

	const errType = $derived.by(() => {
		switch (page.status) {
			case 404:
				return "Not found";
			case 500:
				return "Internal server error";
			default:
				return "Error";
		}
	});
</script>

<NotAvailableMessage class="mt-54" title="{page.status} {errType}">
	{page.error?.message}
	<a
		class="mt-8 block font-extrabold text-amber-200
    underline decoration-4 underline-offset-4
    hover:text-amber-300"
		href="/">Back to home</a
	>
</NotAvailableMessage>
