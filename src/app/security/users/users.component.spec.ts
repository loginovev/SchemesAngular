import { TestBed } from '@angular/core/testing';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {APP_BASE_HREF} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {By} from "@angular/platform-browser";


import { TranslateModule, TranslateService} from "@ngx-translate/core";

import {
  DataTableModule, SharedModule, PanelModule, ToolbarModule, ButtonModule,
  GrowlModule
} from 'primeng/primeng';

import {UsersForm} from "./users.form";
import {UsersService} from "./users.service";
import {AppConfig} from "../../config/app.config";
import {APP_CONFIG, SYSTEM_CONFIGURATION} from "../../config/app.config.const";
import {ServerMessagesService} from "../../server-messages.service";
import {User} from "./user";

class TranslateServiceMock {
  lang:string;

  addLangs(langs:any){}
  setDefaultLang(lang:string){}
  use(lang:string){}
}

let UsersServiceMock = {};

describe('UsersForm', () => {
  beforeEach(()=>{
    TestBed.configureTestingModule({
      imports:[
        BrowserAnimationsModule
        ,HttpClientModule

        , TranslateModule

        , DataTableModule
        , SharedModule
        , PanelModule
        , ToolbarModule
        , ButtonModule
        , GrowlModule

        , RouterModule.forRoot([])
      ],
      declarations: [UsersForm],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/' }
        ,{provide: APP_CONFIG, useValue: SYSTEM_CONFIGURATION}
        ,AppConfig
        ,UsersService
        ,{provide: TranslateService, useClass: TranslateServiceMock}
        ,ServerMessagesService
      ]
    })
  });
  it('should create the UsersForm', () => {
    const fixture = TestBed.createComponent(UsersForm);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
  it('should check the service UsersService', () => {
    const fixture = TestBed.createComponent(UsersForm);
    let usersService = fixture.debugElement.injector.get(UsersService);
    expect(usersService).toBeTruthy();
  });
  it('stub object and injected UserService should not be the same', () => {
    const fixture = TestBed.createComponent(UsersForm);
    let usersService = fixture.debugElement.injector.get(UsersService);

    let getAllTest = function () {
      let users:User[] = [];
      users.push(new User("admin","","","",[]));
      return users;
    };

    let spy = spyOn(usersService,"getAll").and.returnValue(Promise.resolve(getAllTest));

    //fixture.detectChanges();

    fixture.whenStable().then(() => { // wait for async getQuote
      //fixture.detectChanges();        // update view with quote
      expect(fixture.nativeElement.users).toBe(getAllTest);
    });

  });

});
