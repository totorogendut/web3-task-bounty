import { getContext, setContext } from "svelte";

export type TabState = {
	selectedTab: string;
};

export const getTabState = () => getContext("tabState") as TabState;
export const setTabState = (tabState: TabState) => setContext("tabState", tabState);
