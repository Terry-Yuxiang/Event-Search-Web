import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoResultTableComponent } from './no-result-table.component';

describe('NoResultTableComponent', () => {
  let component: NoResultTableComponent;
  let fixture: ComponentFixture<NoResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoResultTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
