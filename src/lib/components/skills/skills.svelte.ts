import { skills } from "./skills-template";

export class SkillsTag {
	query = $state("");
	selectedSkills = $state<string[]>([]);
	allSkills = $state(skills);
	filteredSkills = $derived.by(() =>
		this.allSkills.filter(
			(skill: string) =>
				skill.toLowerCase().includes(this.query.toLowerCase()) &&
				!this.selectedSkills.includes(skill),
		),
	);
}
