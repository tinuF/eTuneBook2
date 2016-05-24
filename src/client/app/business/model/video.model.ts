export class Video {
  source: string;
  code: string;
  description: string;

  constructor(source:string, code:string, description:string) {
    this.source = source;
    this.code =  code;
    this.description = description;
  }
}
