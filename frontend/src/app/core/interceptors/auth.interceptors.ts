import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services';

export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (localStorage.getItem('TOKEN')) {
      return next.handle(
        req.clone({
          setHeaders: {
            Authorization: localStorage.getItem('TOKEN')
            // Tenant: localStorage.getItem('TENANT')
          }
        })
      );
    } else {
      return next.handle(req);
    }
  }
}
