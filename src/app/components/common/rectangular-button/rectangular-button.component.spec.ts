import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RectangularButtonComponent } from './rectangular-button.component';

describe('ButtonComponent', () => {
  let component: RectangularButtonComponent;
  let fixture: ComponentFixture<RectangularButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RectangularButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RectangularButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
