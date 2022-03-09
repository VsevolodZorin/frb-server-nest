import { SkillType } from './skill.type';

export interface ISkillsResponse {
  skills: SkillType[];
  skillsCount?: number;
}
