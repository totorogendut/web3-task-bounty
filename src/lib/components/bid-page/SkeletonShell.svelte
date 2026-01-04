<script lang="ts">
	type Props = {
		width?: string;
		height?: string;
		rounded?: string;
		class?: string;
	};

	const {
		width = "100%",
		height = "1rem",
		rounded = "rounded-md",
		class: className = "",
	} = $props() as Props;
</script>

<div
	class={`relative overflow-hidden bg-slate-800 ${rounded} ${className}`}
	style={`width:${width}; height:${height};`}
>
	<span
		class="animate-shimmer absolute inset-0 -translate-x-full
		       bg-gradient-to-r from-transparent via-slate-700/60 to-transparent"
	/>
</div>
