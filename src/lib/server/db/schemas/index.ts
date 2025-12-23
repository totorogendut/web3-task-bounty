import { defineRelations, eq } from "drizzle-orm";
import * as userSchema from "./users";
import * as taskSchema from "./tasks";

export const relations = defineRelations({ ...userSchema, ...taskSchema }, (r) => ({
	user: {
		tasks: r.many.task({
			from: r.user.id,
			to: r.task.userId,
		}),
		bounties: r.many.bounty({
			from: r.user.id,
			to: r.bounty.id.through(r.project.),
		}),
		projects: r.many.project({
			from: r.user.id,
			to: r.project.ownerId,
		}),
	},
	bounty: {
		parentProject: r.one.project({
			from: r.bounty.id,
			to: r.project.id,
		}),
		comments: r.many.comment({
			from: r.bounty.id,
			to: r.comment.commentableId,
			where: {
				commentableType: "bounty",
			},
		}),
		tasks: r.many.task({
			from: r.bounty.id,
			to: r.task.bountyId,
		}),
	},
	task: {
		comments: r.many.comment({
			from: r.task.id,
			to: r.comment.commentableId,
			where: {
				commentableType: "task",
			},
		}),
	},
	project: {
		bounties: r.many.bounty({
			from: r.project.id,
			to: r.bounty.projectId,
		}),
	},
}));

export type User = typeof userSchema.user.$inferSelect;
export type Session = typeof userSchema.session.$inferSelect;
