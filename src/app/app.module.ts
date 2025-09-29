import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './components/app.component';
import { EditorComponent } from './components/editor/editor.component';
import { ButtonComponent } from './components/toolbar/common/button/button.component';
import { ButtonContainerComponent } from './components/toolbar/common/button-container/button-container.component';
import { ToolbarTopComponent } from './components/toolbar/top/toolbar-top/toolbar-top.component';
import { ToolbarLeftComponent } from './components/toolbar/left/toolbar-left/toolbar-left.component';
import { ConfigurationPanelComponent } from './components/configuration-panel/configuration-panel.component';
import { InfobarComponent } from './components/infobar/infobar.component';
import { MenubarComponent } from './components/menubar/menubar.component';
import { RectangularButtonComponent } from './components/common/rectangular-button/rectangular-button.component';
import { MenuComponent } from './components/toolbar/common/button-container/menu/menu.component';
import { ConfigurationItemComponent } from './components/configuration-panel/configuration-item/configuration-item.component';
import { ConfigurationDirective } from './directive/configuration.directive';
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCardModule} from "@angular/material/card";
import {InputComponent} from './components/configuration-panel/configuration-item/accordion/input/input.component';
import {FormsModule} from "@angular/forms";
import { AccordionComponent } from './components/configuration-panel/configuration-item/accordion/accordion.component';
import { GeometryDialogComponent } from './components/toolbar/common/geometry-dialog/geometry-dialog.component';
import { MatDialogModule} from "@angular/material/dialog";
import { GeometryInputComponent } from './components/toolbar/common/geometry-input/geometry-input.component';
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    ButtonComponent,
    ButtonContainerComponent,
    ToolbarTopComponent,
    ToolbarLeftComponent,
    ConfigurationPanelComponent,
    InfobarComponent,
    MenubarComponent,
    RectangularButtonComponent,
    MenuComponent,
    ConfigurationItemComponent,
    ConfigurationDirective,
    InputComponent,
    AccordionComponent,
    GeometryDialogComponent,
    GeometryInputComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatCardModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule {}
