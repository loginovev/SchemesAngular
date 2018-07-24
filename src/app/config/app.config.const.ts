import { InjectionToken } from '@angular/core';
import {AppConfigConst} from "./config.interface";

export let APP_CONFIG = new InjectionToken<AppConfigConst>('app.config.const');

export const SYSTEM_CONFIGURATION: AppConfigConst = {
  BACKEND_API_ROOT_URL:'http://localhost:8080'
  ,BACKEND_WEBPACK_URL:'http://localhost:4200'
  ,BACKEND_API:'/api'
  ,BACKEND_API_AUTHENTICATE_PATH:'/api/authenticate'
  ,BACKEND_API_LOGOUT_PATH:'/api/logout'
  ,CURRENT_USERNAME:''
  ,CURRENT_AUTHORITIES:[]
  ,IS_AUTHENTICATED:false
  ,CURRENT_SECURITY_LOGIN:''
  ,CURRENT_SECURITY_TOKEN:''
  ,CURRENT_OPTIONS:{}
};
