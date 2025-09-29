import {Component, ElementRef, HostListener, Input, ViewChild} from '@angular/core';
import {ButtonContainer} from "../../../../types/config/type.button-container";

@Component({
  selector: 'app-button-container',
  templateUrl: './button-container.component.html',
  styleUrls: ['./button-container.component.css']
})
export class ButtonContainerComponent {
  @Input()
  public buttonContainer!: ButtonContainer;

  @Input()
  public position!: string;

  public show: boolean = false;

  @ViewChild('menuToggleButton', {read: ElementRef})
  public menuToggleButton!: ElementRef;

  @HostListener('document:click', ['$event.target'])
  public closeMenu(target: HTMLElement): void {
    if(this.menuToggleButton) {
      if(this.menuToggleButton.nativeElement !== target.closest('app-rectangular-button')) {
        this.show = false;
      }
    }
  }

  public toggleMenu = () => {
    this.show = !this.show;
  }
}
