import { ChangeDetectorRef, Component } from '@angular/core';
import { LoadingService } from '../shared/services/loading.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  loading: boolean = false;

  constructor(
    public loaderService: LoadingService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    if (this.router.url === '/') {
      localStorage.removeItem('adminUserId');
      localStorage.removeItem('adminToken');  
    }

    this.loaderService.isLoading.subscribe((value: boolean) => {
      this.loading = value;
      // Force Angular to update the UI immediately after the change
      this.cdr.detectChanges(); 
    });
  }

  isLoaderVisible() {
    return this.loading;
  }
}