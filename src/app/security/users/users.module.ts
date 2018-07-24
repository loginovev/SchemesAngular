import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";

import {
  DataTableModule, SharedModule, Header, Footer, PanelModule, ToolbarModule, ButtonModule,
  GrowlModule
} from 'primeng/primeng';

import {UsersForm} from "./users.form";
import {TranslateModule} from "@ngx-translate/core";

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
    ],
    declarations:[UsersForm ],
    bootstrap:[UsersForm]
})
export class UsersModule {}
