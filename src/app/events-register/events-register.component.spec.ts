import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsRegisterComponent } from './events-register.component';

describe('EventsRegisterComponent', () => {
  let component: EventsRegisterComponent;
  let fixture: ComponentFixture<EventsRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventsRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
