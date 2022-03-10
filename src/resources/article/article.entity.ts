import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export interface ArticleEntity extends Base {}
export class ArticleEntity extends TimeStamps {
  @prop({ unique: true, required: true })
  slug: string;

  @prop({ required: true })
  title: string;

  @prop({ required: true })
  editorData: string;

  @prop({ required: true })
  bodyHtml: string;

  @prop({ required: true })
  author: string;

  @prop({ required: true })
  createdDate: string;

  @prop({ required: true })
  description: string;

  @prop({ required: true })
  imgPreview: string;

  @prop({ required: true })
  language: string;

  // id[]
  @prop({ type: () => [String] })
  tagsIds: string[];
}
