import type { CommentType, User } from "$lib/server/db/schemas";

class CommentState {
	content = $state("");
	submitted = $state("");
	textareaEl: HTMLTextAreaElement | null = $state.raw(null);

	reset() {
		this.content = "";
		this.submitted = "";
	}
}

export let comment = new CommentState();
