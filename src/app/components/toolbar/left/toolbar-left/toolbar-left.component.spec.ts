import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarLeftComponent } from './toolbar-left.component';

describe('ToolbarLeftComponent', () => {
  let component: ToolbarLeftComponent;
  let fixture: ComponentFixture<ToolbarLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarLeftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
