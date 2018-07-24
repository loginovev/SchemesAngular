import { TestBed } from '@angular/core/testing';

import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {By} from "@angular/platform-browser";

import { APP_BASE_HREF } from '@angular/common';

import {ButtonModule, DropdownModule, MenubarModule, SelectButtonModule} from "primeng/primeng";

import {TranslateModule, TranslateService} from '@ngx-translate/core';
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

class TranslateServiceMock {
  lang:string;

  addLangs(langs:any){}
  setDefaultLang(lang:string){}
  use(lang:string){}
}

describe('AppComponent', () => {
  beforeEach(()=>{
    TestBed.configureTestingModule({
      imports:[

        BrowserAnimationsModule
        , FormsModule
        , RouterModule
        , HttpClientModule

        , MenubarModule
        , ButtonModule
        , DropdownModule
        , SelectButtonModule

        , TranslateModule

        , RoutesModule
        , LoginModule
        , DesktopModule
        , UsersModule
        , UserModule
        , SessionsModule
        , LogModule
      ],
      declarations: [AppComponent, MainMenu],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/' }
        ,{provide: APP_CONFIG, useValue: SYSTEM_CONFIGURATION}
        ,AppConfig
        ,{provide:HTTP_INTERCEPTORS,useClass:TokenInterceptor,multi:true}
        ,{provide: TranslateService, useClass: TranslateServiceMock}
        ,ServerMessagesService
      ]
    })
  });
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
  it('should have a main-menu tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    //fixture.detectChanges();

    // query for the title <h1> by CSS element selector
    expect(fixture.debugElement.query(By.css('main-menu')).nativeElement).toBeTruthy();
  });
  it('should have a router-outlet tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    //fixture.detectChanges();

    // query for the title <h1> by CSS element selector
    expect(fixture.debugElement.query(By.css('router-outlet')).nativeElement).toBeTruthy();
  });
});
