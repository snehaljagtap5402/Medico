import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private loaderService: LoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes('api/Wishlist/GetWishlistByAccountId')) {
      return next.handle(request); // Skip loading for this specific request
    }
  
    // Show loader before the request is handled
    this.loaderService.show();
  
    return next.handle(request).pipe(
      finalize(() => {
        this.loaderService.hideWithDelay(2000);  // Hide with a slight delay (200ms)
      })
    );
  }
}