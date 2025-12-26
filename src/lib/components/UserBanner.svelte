<script lang="ts">
	interface Props {
		id: string;
		username: string;
		avatar: string | null;
	}

	const { id, avatar, username }: Props = $props();
</script>

<div>
	<img src={avatar} alt={username} />
	<a href="/u/{username}/">{username}</a>
</div>
