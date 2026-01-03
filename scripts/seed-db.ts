import { seed } from "drizzle-seed";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { relations } from "../src/lib/server/db/schemas";
import { user } from "../src/lib/server/db/schemas/users";
import { skills } from "../src/lib/components/skills/skills-template";
import { task, bounty, comment } from "../src/lib/server/db/schemas/tasks";
import "dotenv/config";
import { jobPostings } from "./demo";

export const db = drizzle(process.env.DATABASE_URL!, { relations });

await seed(db, { bounty, user, task, comment }).refine((f) => ({
	user: {
		columns: {
			walletAddress: f.bitString(),
			avatar: f.default({ defaultValue: "" }),
			skills: f.valuesFromArray({
				values: skills,
				arraySize: 5,
			}),
		},
	},
	bounty: {
		columns: {
			title: f.valuesFromArray({ values: ["Bounty 1", "Test"] }),
			description: f.loremIpsum({ sentencesCount: 8 }),
			content: f.valuesFromArray({
				values: jobPostings,
			}),
			rewardAmount: f.valuesFromArray({
				values: ["10.00", "5.00", "25.00", "3000.00", "500.00", "65.00"],
			}),
			deadline: f.timestamp(),
			skills: f.valuesFromArray({
				values: skills,
				arraySize: 5,
			}),
		},
	},
	task: {
		columns: {
			title: f.valuesFromArray({ values: ["Bounty 1", "Test"] }),
			description: f.loremIpsum({ sentencesCount: 8 }),
		},
	},
	comment: {
		columns: {
			content: f.loremIpsum({ sentencesCount: 3 }),
		},
	},
}));
