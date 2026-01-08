import { getContext } from "svelte";

export type TabState = {
	tab: string;
};

export const getTabState = () => getContext("tabState") as TabState;
