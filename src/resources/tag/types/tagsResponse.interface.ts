import { TagType } from './tag.type';

export interface ITagsResponse {
  tags: TagType[];
  tagsCount?: number;
}
