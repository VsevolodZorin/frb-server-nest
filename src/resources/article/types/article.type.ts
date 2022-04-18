import { TagType } from '@src/resources/tag/types/tag.type';

export type ArticleType = {
  id: string;
  editorData: string;
  bodyHtml: string;
  author: string;
  createdDate: string;
  description: string;
  imgPreview: string;
  language: string;
  slug: string;
  title: string;
  tags: TagType[];
};
