<script lang="ts">
	// --- 1. Runes & State ---

	// Accept initial content as a prop
	let { content = "" } = $props();

	// Reference to the DOM element
	let editorEl: HTMLDivElement;

	// Reactive state for toolbar buttons (tracks if formatting is active at cursor)
	const activeFormats = $state({
		bold: false,
		italic: false,
		underline: false,
		h1: false,
		h2: false,
		ul: false,
		ol: false,
	});

	// Derived state: Live statistics based on current text content
	const stats = $derived.by(() => {
		if (!editorEl) return { words: 0, chars: 0 };
		const text = editorEl.innerText || "";
		const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
		return { words, chars: text.length };
	});

	// --- 2. Logic & Formatting ---

	// Execute a formatting command
	function execute(command: string, value: string | null = null) {
		document.execCommand(command, false, value);
		editorEl?.focus();
		updateActiveState(); // Immediately refresh toolbar state
	}

	// Check which formats are active at the current cursor/selection
	function updateActiveState() {
		if (!editorEl) return;

		// We check specific commands to update the UI state
		activeFormats.bold = document.queryCommandState("bold");
		activeFormats.italic = document.queryCommandState("italic");
		activeFormats.underline = document.queryCommandState("underline");

		// Tag detection is tricky with queryCommandState, so we check parent elements
		const parentTag = document.queryCommandValue("formatBlock") as string;
		activeFormats.h1 = parentTag === "h1";
		activeFormats.h2 = parentTag === "h2";
		activeFormats.ul = document.queryCommandState("insertUnorderedList");
		activeFormats.ol = document.queryCommandState("insertOrderedList");
	}

	// --- 3. Effects & Lifecycle ---

	// Initialize content and event listeners when the element is mounted
	$effect(() => {
		if (editorEl && content) {
			editorEl.innerHTML = content;
		}
	});

	// Attach global selection listeners to update toolbar when user clicks around
	// We use document listener to catch clicks even if clicking outside and back in
	$effect(() => {
		const handleSelection = () => updateActiveState();

		document.addEventListener("selectionchange", handleSelection);
		document.addEventListener("keyup", handleSelection);
		document.addEventListener("mouseup", handleSelection);

		return () => {
			document.removeEventListener("selectionchange", handleSelection);
			document.removeEventListener("keyup", handleSelection);
			document.removeEventListener("mouseup", handleSelection);
		};
	});

	// Helper to get HTML out (e.g., for saving)
	export function getHtml() {
		return editorEl?.innerHTML || "";
	}
</script>

<!-- 
  Using Tailwind CSS classes for the "Sleek Modern" look. 
  If you don't have Tailwind, replace classes with standard CSS in the <style> block below.
-->
<div class="editor-container group">
	<!-- Toolbar -->
	<div class="toolbar">
		<div class="toolbar-group">
			<button
				class="tool-btn {activeFormats.bold ? 'active' : ''}"
				onclick={() => execute("bold")}
				aria-label="Bold"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path><path
						d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"
					></path></svg
				>
			</button>
			<button
				class="tool-btn {activeFormats.italic ? 'active' : ''}"
				onclick={() => execute("italic")}
				aria-label="Italic"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"
					></line><line x1="15" y1="4" x2="9" y2="20"></line></svg
				>
			</button>
			<button
				class="tool-btn {activeFormats.underline ? 'active' : ''}"
				onclick={() => execute("underline")}
				aria-label="Underline"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path><line
						x1="4"
						y1="21"
						x2="20"
						y2="21"
					></line></svg
				>
			</button>
		</div>

		<div class="divider"></div>

		<div class="toolbar-group">
			<button
				class="tool-btn {activeFormats.h1 ? 'active' : ''}"
				onclick={() => execute("formatBlock", "H1")}
				aria-label="Heading 1"
			>
				H1
			</button>
			<button
				class="tool-btn {activeFormats.h2 ? 'active' : ''}"
				onclick={() => execute("formatBlock", "H2")}
				aria-label="Heading 2"
			>
				H2
			</button>
		</div>

		<div class="divider"></div>

		<div class="toolbar-group">
			<button
				class="tool-btn {activeFormats.ul ? 'active' : ''}"
				onclick={() => execute("insertUnorderedList")}
				aria-label="Bullet List"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"
					></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"
					></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line
						x1="3"
						y1="18"
						x2="3.01"
						y2="18"
					></line></svg
				>
			</button>
			<button
				class="tool-btn {activeFormats.ol ? 'active' : ''}"
				onclick={() => execute("insertOrderedList")}
				aria-label="Numbered List"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"
					></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path
						d="M4 10h2"
					></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></svg
				>
			</button>
		</div>
	</div>

	<!-- Editable Area -->
	<div
		bind:this={editorEl}
		class="editor-content"
		contenteditable="true"
		role="textbox"
		aria-multiline="true"
		spellcheck="true"
		placeholder="Start writing..."
	></div>

	<!-- Footer Stats -->
	<div class="footer">
		<span class="stats">{stats.words} words</span>
		<span class="stats">{stats.chars} characters</span>
	</div>
</div>

<style>
	/* --- CSS Variables & Reset --- */
	:root {
		--bg-color: #ffffff;
		--border-color: #e2e8f0;
		--text-primary: #334155;
		--text-secondary: #94a3b8;
		--primary: #3b82f6;
		--primary-bg: #eff6ff;
		--hover-bg: #f1f5f9;
		--font-family: "Inter", system-ui, -apple-system, sans-serif;
	}

	.editor-container {
		border: 1px solid var(--border-color);
		border-radius: 12px;
		overflow: hidden;
		background: var(--bg-color);
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
		display: flex;
		flex-direction: column;
		max-width: 800px;
		font-family: var(--font-family);
		transition: box-shadow 0.2s;
	}

	.editor-container:focus-within {
		box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
		border-color: #cbd5e1;
	}

	/* --- Toolbar --- */
	.toolbar {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 8px 12px;
		border-bottom: 1px solid var(--border-color);
		background: #f8fafc;
	}

	.toolbar-group {
		display: flex;
		gap: 2px;
	}

	.divider {
		width: 1px;
		height: 20px;
		background-color: var(--border-color);
		margin: 0 8px;
	}

	/* --- Buttons --- */
	.tool-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border: none;
		background: transparent;
		border-radius: 6px;
		color: var(--text-secondary);
		cursor: pointer;
		font-weight: 600;
		font-size: 14px;
		transition: all 0.15s ease;
	}

	.tool-btn:hover {
		background-color: var(--hover-bg);
		color: var(--text-primary);
	}

	.tool-btn.active {
		background-color: var(--primary-bg);
		color: var(--primary);
	}

	/* --- Editor Content --- */
	.editor-content {
		flex: 1;
		padding: 24px 32px;
		min-height: 200px;
		outline: none;
		color: var(--text-primary);
		line-height: 1.7;
		font-size: 16px;
	}

	/* Placeholder Logic via CSS */
	.editor-content:empty:before {
		content: attr(placeholder);
		color: #cbd5e1;
		pointer-events: none;
		display: block; /* For Firefox */
	}

	/* Typography Styles within Editor */
	.editor-content h1 {
		font-size: 2em;
		font-weight: 700;
		margin-top: 0.5em;
		margin-bottom: 0.5em;
		line-height: 1.2;
	}
	.editor-content h2 {
		font-size: 1.5em;
		font-weight: 600;
		margin-top: 0.5em;
		margin-bottom: 0.5em;
		line-height: 1.3;
	}
	.editor-content p {
		margin-bottom: 1em;
	}
	.editor-content ul,
	.editor-content ol {
		margin-left: 1.5em;
		margin-bottom: 1em;
	}
	.editor-content blockquote {
		border-left: 4px solid var(--border-color);
		padding-left: 1em;
		color: var(--text-secondary);
		font-style: italic;
		margin: 1em 0;
	}
	.editor-content a {
		color: var(--primary);
		text-decoration: underline;
	}

	/* --- Footer --- */
	.footer {
		padding: 8px 16px;
		border-top: 1px solid var(--border-color);
		display: flex;
		justify-content: flex-end;
		gap: 16px;
		background: #f8fafc;
	}

	.stats {
		font-size: 12px;
		color: var(--text-secondary);
	}
</style>
