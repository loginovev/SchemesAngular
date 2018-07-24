export class Log{

  private _date:Date;
  private _messageType:string;
  private _username:string;
  private _event:string;
  private _structure:string;
  private _data:string;
  private _message:string;

  constructor(
    date:Date,
    messageType:string,
    username:string,
    event:string,
    structure:string,
    data:string,
    message:string
  ){
    this._date = date;
    this._messageType = messageType;
    this._username = username;
    this._event = event;
    this._structure = structure;
    this._data = data;
    this._message = message;
  }


  get date(): Date {
    return this._date;
  }

  get messageType(): string {
    return this._messageType;
  }

  get username(): string {
    return this._username;
  }

  get event(): string {
    return this._event;
  }

  get structure(): string {
    return this._structure;
  }

  get data(): string {
    return this._data;
  }

  get message(): string {
    return this._message;
  }
}
