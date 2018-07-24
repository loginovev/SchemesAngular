import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";

import {AngularScheme} from "./ang-scheme";

@NgModule({
  declarations: [AngularScheme],
  imports: [BrowserModule],
  bootstrap: [AngularScheme],
  exports:[AngularScheme]
})
export class AngSchemeModule{}
