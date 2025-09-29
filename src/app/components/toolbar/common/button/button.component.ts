import {Component, Input} from '@angular/core';
import {Button} from "../../../../types/config/type.button";
import {Operator} from "../../../../editor/operator/operator";
import {Api} from "../../../../editor/interface/interface.api";
import {MatDialog} from "@angular/material/dialog";
import {GeometryDialogComponent} from "../geometry-dialog/geometry-dialog.component";


@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  @Input()
  public button!: Button;

  @Input()
  public className!: Api;

  private operator!: Operator;
  public dialog: MatDialog;

  constructor(operator: Operator, dialog: MatDialog) {
    this.operator = operator;
    this.dialog = dialog;
  }

  public buttonClickHandler = () => {
    if(this.button.clickOpenDialog) {
      this.openDialog();
    } else {
      this.operator.operate(this.className, this.button.methodName);
    }
  }

  private openDialog = () => {
    const dialogRef = this.dialog.open(GeometryDialogComponent, {
      data: {
        className: this.className,
        button: this.button
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
