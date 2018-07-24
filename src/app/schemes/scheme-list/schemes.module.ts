import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";

import {TranslateModule} from "@ngx-translate/core";

import {
  DataTableModule, SharedModule, PanelModule, ToolbarModule, ButtonModule,
  GrowlModule
} from 'primeng/primeng';

import {SchemesForm} from "./schemes.form";
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
  declarations:[SchemesForm],
  bootstrap:[SchemesForm]
})
export class SchemesModule{}
