import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowsViewComponent } from './shows-view.component';

describe('ShowsViewComponent', () => {
  let component: ShowsViewComponent;
  let fixture: ComponentFixture<ShowsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
