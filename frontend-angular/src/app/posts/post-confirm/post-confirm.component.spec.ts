import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostConfirmComponent } from './post-confirm.component';

describe('PostConfirmComponent', () => {
  let component: PostConfirmComponent;
  let fixture: ComponentFixture<PostConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
