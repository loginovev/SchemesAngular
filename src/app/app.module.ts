import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {ButtonModule, DropdownModule, MenubarModule, SelectButtonModule} from "primeng/primeng";

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import {RoutesModule} from './app.routes';
import {TokenInterceptor} from "./security/utils/token.interceptor";
import {LoginModule} from "./security/login/login.module";
import {AppConfig} from "./config/app.config";
import {DesktopModule} from "./desktop/desktop.module";
import {APP_CONFIG, SYSTEM_CONFIGURATION} from "./config/app.config.const";
import {MainMenu} from "./main-menu/main.menu";
import {UsersModule} from './security/users/users.module';
import {UserModule} from "./security/user/user.module";
import {SessionsModule} from "./security/sessions/sessions.module";
import {ServerMessagesService} from "./server-messages.service";
import {LogModule} from "./security/log/log.module";
import {SchemesModule} from "./schemes/scheme-list/schemes.module";
import {SchemeModule} from "./schemes/scheme-entity/scheme.module";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({

  imports: [
    BrowserModule
    , BrowserAnimationsModule
    , FormsModule
    , RouterModule
    , HttpClientModule

    , MenubarModule
    , ButtonModule
    , DropdownModule
    , SelectButtonModule

    , TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })

    , RoutesModule
    , LoginModule
    , DesktopModule
    , UsersModule
    , UserModule
    , SessionsModule
    , LogModule
    , SchemesModule
    , SchemeModule
  ],
  declarations: [AppComponent, MainMenu],
  bootstrap: [AppComponent, MainMenu],
  providers: [
    {provide: APP_CONFIG, useValue: SYSTEM_CONFIGURATION}
    ,AppConfig
    ,{provide:HTTP_INTERCEPTORS,useClass:TokenInterceptor,multi:true}
    ,ServerMessagesService
  ]
})
export class AppModule { }
