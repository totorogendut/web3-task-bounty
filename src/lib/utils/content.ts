import { marked } from "marked";

export const parseMarkdown = async (md: string) => {
	return marked(md);
};
