import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { LoadingService } from './loading.service';
import { ToastService } from './toast.service';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const loading = inject(LoadingService);
  const toast = inject(ToastService);
  const token = authService.getToken();

  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  loading.show();
  return next(req).pipe(
    tap(() => {}),
    catchError((err: any) => {
      if (err?.status >= 400) {
        const key = err?.error?.message ? err.error.message : 'common.error';
        toast.push(key, 'error');
      }
      return throwError(() => err);
    }),
    finalize(() => loading.hide())
  );
};
