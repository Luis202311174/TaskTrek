import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasktrekComponent } from './tasktrek.component';

describe('TasktrekComponent', () => {
  let component: TasktrekComponent;
  let fixture: ComponentFixture<TasktrekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasktrekComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TasktrekComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
