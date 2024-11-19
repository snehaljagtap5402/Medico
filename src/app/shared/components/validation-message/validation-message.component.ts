import { Component, Input } from '@angular/core';

@Component({
  selector: 'validation-message',
  templateUrl: './validation-message.component.html',
  styleUrls: ['./validation-message.component.scss']
})
export class ValidationMessageComponent {
  constructor() { }
  @Input() message!: string;
  ngOnInit() { }
}

