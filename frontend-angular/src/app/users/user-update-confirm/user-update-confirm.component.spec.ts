import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUpdateConfirmComponent } from './user-update-confirm.component';

describe('UserUpdateConfirmComponent', () => {
  let component: UserUpdateConfirmComponent;
  let fixture: ComponentFixture<UserUpdateConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserUpdateConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUpdateConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
