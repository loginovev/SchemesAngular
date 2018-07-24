import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";

import {TranslateModule} from "@ngx-translate/core";

import {
  ButtonModule,
  DataTableModule,
  DropdownModule,
  FieldsetModule,
  GrowlModule,
  InputTextModule,
  PanelModule,
  PasswordModule,
  ToolbarModule,
  CheckboxModule, ListboxModule
} from "primeng/primeng";

import {UserForm} from "./user.form";

@NgModule({
  imports: [
    FormsModule
    , ReactiveFormsModule
    , BrowserModule
    , TranslateModule
    , DataTableModule
    , DropdownModule
    , PanelModule
    , ToolbarModule
    , ButtonModule
    , InputTextModule
    , PasswordModule
    , GrowlModule
    , FieldsetModule
    , GrowlModule
    , CheckboxModule
    , ListboxModule
  ],
  declarations:[UserForm],
  bootstrap:[UserForm]
})
export class UserModule{}
