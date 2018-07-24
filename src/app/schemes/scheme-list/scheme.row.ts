export class SchemeRow{
  private _id:string;
  private _version:string;
  private _title:string;


  constructor(id: string, title: string) {
    this._id = id;
    this._title = title;
  }


  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }
}
