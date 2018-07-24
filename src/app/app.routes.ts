import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from "@angular/core";

import {UsersForm} from "./security/users/users.form";
import {LoginForm} from "./security/login/login.form";
import {DesktopForm} from "./desktop/desktop.form";
import {UserForm} from "./security/user/user.form";
import {SessionsForm} from "./security/sessions/sessions.form";
import {LogForm} from "./security/log/log.form";

import {SchemesForm} from "./schemes/scheme-list/schemes.form";
import {SchemeForm} from "./schemes/scheme-entity/scheme.form";

export const routes:Routes = [
  {path: '', component: LoginForm},
  {path: 'authenticate', component: LoginForm},
  {path: 'users', component: UsersForm},
  {path:'user/:username',component:UserForm},
  {path:'desktop',component:DesktopForm},
  {path:'sessions',component:SessionsForm},
  {path:'log',component:LogForm},

  {path:'schemes',component:SchemesForm},
  {path:'scheme/:id',component:SchemeForm}
];

export const RoutesModule: ModuleWithProviders = RouterModule.forRoot(routes);
