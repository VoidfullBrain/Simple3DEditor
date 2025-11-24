import {Component, ElementRef, HostListener, Input, ViewChild, OnInit, OnDestroy} from '@angular/core';
import {ButtonContainer} from "../../../../types/config/type.button-container";
import {Editor} from "../../../../editor/editor";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-button-container',
  templateUrl: './button-container.component.html',
  styleUrls: ['./button-container.component.css']
})
export class ButtonContainerComponent implements OnInit, OnDestroy {
  @Input()
  public buttonContainer!: ButtonContainer;

  @Input()
  public position!: string;

  public show: boolean = false;
  public currentIcon: string = '';

  private subscriptions: Subscription[] = [];

  @ViewChild('menuToggleButton', {read: ElementRef})
  public menuToggleButton!: ElementRef;

  constructor(private editor: Editor) {}

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

  ngOnInit(): void {
    this.currentIcon = this.buttonContainer.icon;

    if (this.buttonContainer.name === 'selection-type') {
      this.updateSelectionTypeIcon();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private updateSelectionTypeIcon(): void {
    const button = this.buttonContainer.buttons.find(b => b.name === this.editor.selectionType);
    if (button) {
      this.currentIcon = button.icon;
    }
  }

  public getDisplayIcon(): string {
    if (this.buttonContainer.name === 'selection-type') {
      const button = this.buttonContainer.buttons.find(b => b.name === this.editor.selectionType);
      return button ? button.icon : this.buttonContainer.icon;
    }
    return this.currentIcon;
  }
}
