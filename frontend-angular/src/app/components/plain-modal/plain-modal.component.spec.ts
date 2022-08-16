import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlainModalComponent } from './plain-modal.component';

describe('PlainModalComponent', () => {
  let component: PlainModalComponent;
  let fixture: ComponentFixture<PlainModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlainModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlainModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
