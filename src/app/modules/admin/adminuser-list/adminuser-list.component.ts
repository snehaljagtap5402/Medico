import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/shared/services/modules/admin.service';
@Component({
  selector: 'app-adminuser-list',
  templateUrl: './adminuser-list.component.html',
  styleUrls: ['./adminuser-list.component.scss']
})
export class AdminuserListComponent {
  public userForm!: FormGroup;
  public users: any[] = [];
  public errorMessage: string | null = null;
  public currentPage: number = 1; // Current page
  public itemsPerPage: number = 5; // Number of items per page
  public totalItems: number = 0; // Total number of items
  public pageCount: number = 0;

  constructor(private adminService: AdminService, private toastrService: ToastrService) { }

  public ngOnInit(): void {
    this.initializeFormFields();
    this.fetchAllUsers();
  }

  public initializeFormFields(): void {
    this.userForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
    });
  }

  public fetchAllUsers(): void {
    this.adminService.getAllUsers().subscribe(
      (data: any) => {
        this.users = data;
        this.totalItems = this.users.length;
      },
      (error) => {
        this.errorMessage = 'Error fetching users';
        console.error(error);
      }
    );
  }

  public deleteUser(user: any): void {
    if (user) {
      this.adminService.deleteAdminUser(user.userId).subscribe(
        () => {
          this.users = this.users.filter(u => u.userId !== user.userId);
          this.totalItems--;
          this.toastrService.success('User deleted successfully!', 'Success');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        (error: any) => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.toastrService.error(error.error, 'Error while deleting user!');
        }
      );
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  goToFirstPage(): void {
    this.currentPage = 1;
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage(): void {
    const totalPages = this.getTotalPages();
    if (this.currentPage < totalPages) {
      this.currentPage++;
    }
  }

  goToLastPage(): void {
    this.currentPage = this.getTotalPages();
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get paginatedUsers(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.users.slice(startIndex, startIndex + this.itemsPerPage);
  }

  getPaginationRange(): number[] {
    return Array.from({ length: this.getTotalPages() }, (_, i) => i + 1);
  }
}


