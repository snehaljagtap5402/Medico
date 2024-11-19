import { Component, OnInit } from '@angular/core';
declare var $: any; // Declare jQuery

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  slideIndex = 0;
  ngAfterViewInit(): void {
    setInterval(() => {
      this.nextSlide();
    }, 10000);
  }

  nextSlide() {
    const slides = document.getElementsByClassName('carousel-item') as HTMLCollectionOf<HTMLElement>;

    // Check if slides exist before manipulation
    if (slides.length > 0) {
      for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
      }

      this.slideIndex++;

      if (this.slideIndex >= slides.length) {
        this.slideIndex = 0;
      }

      slides[this.slideIndex].style.display = 'block';
    }
  }

  onClickNext() {
    this.nextSlide();
  }

  onClickPrev() {
    const slides = document.getElementsByClassName('carousel-item') as HTMLCollectionOf<HTMLElement>;

    if (slides.length > 0) {
      slides[this.slideIndex].style.display = 'none';

      this.slideIndex--;

      if (this.slideIndex < 0) {
        this.slideIndex = slides.length - 1;
      }

      slides[this.slideIndex].style.display = 'block';
    }
  }
}