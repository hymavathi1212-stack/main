import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningcalendarComponent } from './learningcalendar.component';

describe('LearningcalendarComponent', () => {
  let component: LearningcalendarComponent;
  let fixture: ComponentFixture<LearningcalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearningcalendarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningcalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
