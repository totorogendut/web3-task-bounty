import type { CommentType, User } from "$lib/server/db/schemas";

export class MarkdownFormState {
	content = $state("");
	submitted = $state("");
	textareaEl: HTMLTextAreaElement | null = $state.raw(null);

	reset() {
		this.content = "";
		this.submitted = "";
	}
}
