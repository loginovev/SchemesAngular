import {NgModule} from "@angular/core";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";

import {
  ButtonModule, CalendarModule, DataTableModule, DropdownModule, GrowlModule,
  PanelModule,
  ToolbarModule
} from "primeng/primeng";

import {TranslateModule} from "@ngx-translate/core";

import {LogForm} from "./log.form";

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
    , CalendarModule
    , DropdownModule
  ],
  bootstrap:[LogForm],
  declarations:[LogForm]
})
export class LogModule{}
