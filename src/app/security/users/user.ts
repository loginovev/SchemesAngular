export class User{

    private _username:string = '';
    private _firstName:string = '';
    private _surname:string = '';
    private _password:string = '';
    private _authorities:string[] = [];
    private _options:Object = {};
    private _banned:boolean = false;

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get firstName(): string {
        return this._firstName;
    }

    set firstName(value: string) {
        this._firstName = value;
    }

    get surname(): string {
        return this._surname;
    }

    set surname(value: string) {
        this._surname = value;
    }

    get password(): string {
      return this._password;
    }

    get authorities(): string[] {
      return this._authorities;
    }

    get options(): Object {
      return this._options;
    }

    set options(value: Object) {
      this._options = value;
    }

    get banned(): boolean {
      return this._banned;
    }

    set banned(value: boolean) {
      this._banned = value;
    }

  constructor(username: string, firstName: string, surname: string, password?:string, authorities?:string[],options?:Object,banned?:boolean) {
        this._username = username;
        this._firstName = firstName;
        this._surname = surname;

        if (password){
          this._password = password;
        }
        if (authorities){
          this._authorities = authorities;
        }
        if(options){
          this._options = options;
        }
        if(banned){
          this._banned = banned;
        }
    }
}
