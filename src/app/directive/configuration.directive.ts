import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[configurationDirective]'
})
export class ConfigurationDirective {
  public viewContainerRef: ViewContainerRef;

  constructor(viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
  }

}
