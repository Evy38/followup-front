import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardHomeComponent } from './dashboard-home.component';
import { CandidatureService } from '../../../../core/services/candidature.service';
import { of } from 'rxjs';

describe('DashboardHomeComponent', () => {
  let component: DashboardHomeComponent;
  let fixture: ComponentFixture<DashboardHomeComponent>;
  let service: jasmine.SpyObj<CandidatureService>;

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('CandidatureService', ['getMyCandidatures']);

    await TestBed.configureTestingModule({
      imports: [DashboardHomeComponent, HttpClientTestingModule],
      providers: [
        { provide: CandidatureService, useValue: serviceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardHomeComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(CandidatureService) as jasmine.SpyObj<CandidatureService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load candidatures on init', () => {
    const mockData = [
      { id: 1, company: 'A', relances: [], entretiens: [] },
      { id: 2, company: 'B', relances: [], entretiens: [] }
    ];
    service.getMyCandidatures.and.returnValue(of(mockData as any));

    component.ngOnInit();

    expect(component.candidatures.length).toBe(2);
    expect(component.totalCandidatures).toBe(2);
  });

  it('should calculate entretiens prevus', () => {
    component.candidatures = [
      { id: 1, entretiens: [{ statut: 'prevu' }] } as any,
      { id: 2, entretiens: [{ statut: 'passe' }] } as any
    ];

    expect(component.entretiensPrevus).toBe(1);
  });
});