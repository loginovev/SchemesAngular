import {User} from "../users/user";

export class Session{

  private _username:string = '';
  private _firstName:string = '';
  private _surname:string = '';
  private _sessionBegin:Date;
  private _lastActivity:Date;


  constructor(username:string, firstName:string, surname:string, sessionBegin: Date, lastActivity: Date) {
    this._sessionBegin = sessionBegin;
    this._lastActivity = lastActivity;

    this._username = username;
    this._firstName = firstName;
    this._surname = surname;
  }

  get username(): string {
    return this._username;
  }

  get firstName(): string {
    return this._firstName;
  }

  get surname(): string {
    return this._surname;
  }

  get sessionBegin(): Date {
    return this._sessionBegin;
  }

  get lastActivity(): Date {
    return this._lastActivity;
  }
}
