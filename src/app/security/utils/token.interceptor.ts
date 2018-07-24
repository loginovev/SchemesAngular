import {Inject, Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {AppConfigConst} from "../../config/config.interface";
import {APP_CONFIG} from "../../config/app.config.const";

@Injectable()
export class TokenInterceptor implements HttpInterceptor{

  private readonly HEADER_SECURITY_LOGIN:string = "secret-login";
  private readonly HEADER_SECURITY_DIGIT:string = "secret-digit";

  constructor(@Inject(APP_CONFIG) private config: AppConfigConst){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    req = req.clone({ headers: req.headers.set('Content-Type', 'application/json;charset=utf-8') });

    if (
      req.url.includes(this.config.BACKEND_API_ROOT_URL+this.config.BACKEND_API)
      && !(
        req.url===this.config.BACKEND_API_ROOT_URL+this.config.BACKEND_API_AUTHENTICATE_PATH
        || req.url===this.config.BACKEND_API_ROOT_URL+this.config.BACKEND_API_LOGOUT_PATH
        )
    ){
      if (this.config.CURRENT_SECURITY_LOGIN!=='' && this.config.CURRENT_SECURITY_TOKEN!==''){
        req = req.clone({ headers: req.headers.set(this.HEADER_SECURITY_LOGIN, this.config.CURRENT_SECURITY_LOGIN) });
        req = req.clone({ headers: req.headers.set(this.HEADER_SECURITY_DIGIT, this.config.CURRENT_SECURITY_TOKEN) });
      }
    }

    return next.handle(req);
  }
}
