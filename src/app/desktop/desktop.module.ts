import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {DesktopForm} from "./desktop.form";

@NgModule({
  imports: [ FormsModule, ReactiveFormsModule, BrowserModule ]
  ,bootstrap: [ DesktopForm ]
  ,declarations: [ DesktopForm ]
})
export class DesktopModule{}
