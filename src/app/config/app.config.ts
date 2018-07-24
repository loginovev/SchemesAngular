import {Inject, Injectable} from "@angular/core";
import {APP_CONFIG} from "./app.config.const";
import {AppConfigConst} from "./config.interface";

@Injectable()
export class AppConfig{

  constructor(@Inject(APP_CONFIG) private config: AppConfigConst) {}

  get BACKEND_API_ROOT_URL(): string {
    return this.config.BACKEND_API_ROOT_URL;
  }

  get BACKEND_WEBPACK_URL(): string {
    return this.config.BACKEND_WEBPACK_URL;
  }

  get BACKEND_API_AUTHENTICATE_PATH(): string {
    return this.config.BACKEND_API_AUTHENTICATE_PATH;
  }

  get BACKEND_API_LOGOUT_PATH(): string {
    return this.config.BACKEND_API_LOGOUT_PATH;
  }

  get CURRENT_USERNAME(): string {
    return this.config.CURRENT_USERNAME;
  }

  get CURRENT_AUTHORITIES(): string[] {
    return this.config.CURRENT_AUTHORITIES;
  }

  get IS_AUTHENTICATED(): boolean {
    return this.config.IS_AUTHENTICATED;
  }

  get CURRENT_SECURITY_LOGIN(): string {
    return this.config.CURRENT_SECURITY_LOGIN;
  }

  get CURRENT_SECURITY_TOKEN(): string {
    return this.config.CURRENT_SECURITY_TOKEN;
  }

  get BACKEND_API(): string {
    return this.config.BACKEND_API;
  }

  get CURRENT_OPTIONS(): any {
    return this.config.CURRENT_OPTIONS;
  }

  set BACKEND_API_ROOT_URL(value: string){
    this.config.BACKEND_API_ROOT_URL = value;
  }

  set CURRENT_USERNAME(value: string) {
    this.config.CURRENT_USERNAME = value;
  }

  set CURRENT_AUTHORITIES(value: string[]) {
    this.config.CURRENT_AUTHORITIES = value;
  }

  set IS_AUTHENTICATED(value: boolean) {
    this.config.IS_AUTHENTICATED = value;
  }

  set CURRENT_SECURITY_LOGIN(value: string) {
    this.config.CURRENT_SECURITY_LOGIN = value;
  }

  set CURRENT_SECURITY_TOKEN(value: string) {
    this.config.CURRENT_SECURITY_TOKEN = value;
  }

  set CURRENT_OPTIONS(value: any) {
    this.config.CURRENT_OPTIONS = value;
  }
}
