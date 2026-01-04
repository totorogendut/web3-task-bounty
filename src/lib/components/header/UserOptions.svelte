<script lang="ts">
	import { page } from "$app/state";
	import { logout } from "$lib/user.svelte";
	import Avatar from "$lib/components/user/Avatar.svelte";
	import { CirclePower, User } from "@lucide/svelte";

	const user = page.data.user;
</script>

<div
	class="user-opts absolute top-full right-0 z-50 hidden w-50
	 -translate-y-2 flex-col overflow-hidden rounded-sm bg-white
	 py-2 font-semibold text-black/80 transition transition-discrete
	 group-hover/usernav:flex"
>
	<strong>{user?.name}</strong>
	<a class="flex gap-2 px-2 py-1 hover:bg-orange-100" href="/u/{user?.id}">
		<User />
		Profile</a
	>
	<button
		class="-mb-2 flex cursor-pointer gap-2 bg-red-600 px-2 py-3
		text-white/90 hover:brightness-90"
		onclick={logout}
	>
		<CirclePower />
		Logout</button
	>
</div>

<style>
	.user-opts {
		@starting-style {
			transform: translateY(4px);
			opacity: 0;
		}
	}
</style>
