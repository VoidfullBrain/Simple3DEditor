import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import * as THREE from "three"
import {Editor} from "../../editor/editor";
import {ConfigurationDirective} from "../../directive/configuration.directive";
import {Subscription} from "rxjs";
import {ConfigurationItemComponent} from "./configuration-item/configuration-item.component";

@Component({
  selector: 'app-configuration-panel',
  templateUrl: './configuration-panel.component.html',
  styleUrls: ['./configuration-panel.component.css']
})
export class ConfigurationPanelComponent implements OnInit, AfterViewInit {
  @ViewChild(ConfigurationDirective, {static: true})
  configurationDirective!: ConfigurationDirective;

  private editor!: Editor;

  public selectionSubscription: Subscription;
  public deselectionSubscription: Subscription;

  constructor(editor: Editor) {
    this.editor = editor;

    this.selectionSubscription = this.editor.objectSelected.subscribe(this.loadConfigurationItems);
    this.deselectionSubscription = this.editor.objectDeselected.subscribe(this.loadConfigurationItems);
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
  }

  private loadConfigurationItems = () => {
    const selectedObjects = this.editor.selectedObjects;

    const viewContainerRef = this.configurationDirective.viewContainerRef;
    viewContainerRef.clear();

    selectedObjects.forEach((selectedObject: THREE.Object3D) => {
      const componentRef = viewContainerRef.createComponent<ConfigurationItemComponent>(ConfigurationItemComponent);
      componentRef.instance.selectedObject = selectedObject;
    });
  }
}
