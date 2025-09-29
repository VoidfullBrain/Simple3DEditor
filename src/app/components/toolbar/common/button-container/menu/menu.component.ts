import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Button} from "../../../../../types/config/type.button";
import {Position} from "../../../../../enum/enum.position";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements  OnInit, AfterViewInit{
  @Input()
  public buttons!: Array<Button>;

  @Input()
  public className!: any;

  @Input()
  public position!: string;

  @ViewChild('menuDiv')
  public menuDivRef!: ElementRef;

  private positionMenu = (): void => {
    let style = '';
    let menuDiv = this.menuDivRef.nativeElement;
    let menuWidth = menuDiv.clientWidth;
    let menuHeight = menuDiv.clientHeight;

    switch (this.position) {
      case Position.left:
        style = `left: 0; top: 0`;
        break;
      case Position.right:
        style = `right: -${menuWidth + 3}px; top: 0`;
        break;
      case Position.top:
        style = `left: 0; top: 0`;
        break;
      case Position.bottom:
        style = `left: 0; bottom: -${menuHeight + 2}px`;
        break;
    }

    menuDiv.setAttribute('style', style);
  }

  ngAfterViewInit(): void {
    this.positionMenu();
  }

  ngOnInit(): void {
  }

}
