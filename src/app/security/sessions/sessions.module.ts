import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";

import {ButtonModule, DataTableModule, GrowlModule, PanelModule, ToolbarModule} from "primeng/primeng";

import {TranslateModule} from "@ngx-translate/core";

import {SessionsForm} from "./sessions.form";

@NgModule({
  imports:[
    FormsModule
    , ReactiveFormsModule
    , BrowserModule
    , TranslateModule
    , DataTableModule
    , PanelModule
    , ToolbarModule
    , ButtonModule
    , GrowlModule
  ],
  bootstrap:[SessionsForm],
  declarations:[SessionsForm]
})
export class SessionsModule{}
