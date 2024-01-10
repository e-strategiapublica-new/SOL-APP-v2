import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodePassComponent } from './code-pass.component';

describe('CodePassComponent', () => {
  let component: CodePassComponent;
  let fixture: ComponentFixture<CodePassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodePassComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodePassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
