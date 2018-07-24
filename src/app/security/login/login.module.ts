import { NgModule }      from '@angular/core';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import {
  ButtonModule, InputTextModule, PanelModule, PasswordModule, GrowlModule,
  SelectButtonModule
} from 'primeng/primeng';

import {LoginForm} from './login.form';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
      FormsModule
      , ReactiveFormsModule
      , BrowserModule
      , TranslateModule
      , PanelModule
      , InputTextModule
      , PasswordModule
      , ButtonModule
      , SelectButtonModule
      , GrowlModule
    ]
    ,bootstrap: [ LoginForm ]
    ,declarations: [ LoginForm ]
})
export class LoginModule { }
