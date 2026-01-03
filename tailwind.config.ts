import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			animation: {
				shimmer: "shimmer 1.6s infinite linear",
			},
			keyframes: {
				shimmer: {
					"100%": { transform: "translateX(100%)" },
				},
			},
			typography: ({ theme }) => ({
				DEFAULT: {
					css: {},
				},
			}),
		},
	},
	plugins: [],
};

export default config;
