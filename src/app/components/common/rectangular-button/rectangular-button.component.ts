import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-rectangular-button',
  templateUrl: './rectangular-button.component.html',
  styleUrls: ['./rectangular-button.component.css']
})
export class RectangularButtonComponent {
  @Input()
  public text!: string;

  @Input()
  public type!: string;

  @Input()
  public isDisabled: boolean = false;

  @Input()
  public showText: boolean = false;

  @Input()
  public icon!: string;

  @Output()
  public btnClick: EventEmitter<any> = new EventEmitter();

  public get name(): string {
    return this.text;
  }

  onClick() {
    this.btnClick.emit();
  }
}
