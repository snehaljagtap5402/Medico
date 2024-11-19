import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public isAdmin: boolean = false;
  public isAdminRoute: boolean = false;

  footerItems: { title: string, subitems: string[] }[] = [
    { title: 'Bullion', subitems: ['Performed Bullion', 'Soldering', 'Misc New', 'View All Bullion'] },
    { title: 'Findings', subitems: ['Popular Searches', 'Stone Shapes', 'Stone Quality', 'View All Findings'] },
    { title: 'Collets', subitems: ['Ring Shank Style', 'Eternity Rings', 'Cast / Stamped Rings', 'Phone Support', 'View All Collets'] },
    { title: 'Shanks', subitems: ['Ring Shank Profile', 'Ring Shank Style', 'Eternity Rings New', 'Cast / Stamped Rings', 'View All Shanks'] },
    { title: 'Cast Rings', subitems: ['Performed Bullion', 'Soldering', 'Misc New', 'View All Cast Rings'] }
  ];

  constructor( private router: Router ){}

  public ngOnInit(){
    if(localStorage.getItem('adminUserId')){
      this.isAdmin = true;
    }
    this.router.events.subscribe(() => {
      this.isAdminRoute = this.router.url.startsWith('/admin');
    });
  }
}