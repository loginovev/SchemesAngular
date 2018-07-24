import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";

import {TranslateModule} from "@ngx-translate/core";

import {
  DataTableModule, SharedModule, PanelModule, ToolbarModule, ButtonModule,
  GrowlModule
} from 'primeng/primeng';

import {SchemeForm} from "./scheme.form";
import {AngSchemeModule} from "../ang-scheme/scheme.module";

@NgModule({
  imports: [
    FormsModule
    , ReactiveFormsModule
    , BrowserModule
    , TranslateModule
    , DataTableModule
    , SharedModule
    , PanelModule
    , ToolbarModule
    , ButtonModule
    , GrowlModule
    , AngSchemeModule
  ],
  declarations:[SchemeForm],
  bootstrap:[SchemeForm]
})
export class SchemeModule{}
