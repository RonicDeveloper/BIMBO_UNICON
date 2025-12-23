import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomationViewComponent } from './automation-view.component';

describe('AutomationViewComponent', () => {
  let component: AutomationViewComponent;
  let fixture: ComponentFixture<AutomationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutomationViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
