import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tasktrek } from './tasktrek';

describe('Tasktrek', () => {
  let component: Tasktrek;
  let fixture: ComponentFixture<Tasktrek>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tasktrek]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tasktrek);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
