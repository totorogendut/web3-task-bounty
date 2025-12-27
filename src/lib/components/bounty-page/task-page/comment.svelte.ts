class CommentState {
	content = $state("");
	submitted = $state("");
	textareaEl: HTMLTextAreaElement | null = $state(null);

	reset() {
		this.content = "";
		this.submitted = "";
	}
}

export let comment = new CommentState();
