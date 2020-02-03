import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RelatedStudiesPage } from './related-studies.page';

describe('RelatedStudiesPage', () => {
  let component: RelatedStudiesPage;
  let fixture: ComponentFixture<RelatedStudiesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatedStudiesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RelatedStudiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
