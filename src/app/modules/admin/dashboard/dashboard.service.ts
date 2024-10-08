import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
const token = localStorage.getItem('accessToken') || null;
import { environment } from 'environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private _dashboardData: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private _branchNames: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(null);

  constructor(private http: HttpClient) { }

  private _data: BehaviorSubject<any | null> = new BehaviorSubject(null);

  /**
   * Constructor
   */

  httpOptionsFormdata = {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
  };

  getBranchNames(): Observable<string[]> {
    return this.http.get<any[]>('/api/hospital').pipe(
      tap(data => this._branchNames.next(data.map(item => item.name))),
      map(data => data.map(item => item.name))
    );
  }

  getKhet(): Observable<any> {
    return this.http
      .get<any>(environment.baseURL + '/api/get_khet')
      .pipe(
        tap((result) => {
          this._data.next(result);
        })
      );
  }

  getProvince(id: any): Observable<any> {
    return this.http
      .get<any>(environment.baseURL + '/api/get_province/' + id
      )
      .pipe(
        tap((result) => {
          this._data.next(result);
        })
      );
  }

  getHospital(id: any): Observable<any> {
    return this.http
      .get<any>(environment.baseURL + '/api/get_hospital/' + id)
      .pipe(
        tap((result) => {
          this._data.next(result);
        })
      );
  }

  getDashboard(): Observable<any> {
    const branchId = localStorage.getItem('hospital');
    return this.http.get<any>('/api/dashboard', { params: { branchId } }).pipe(
      tap(data => this._dashboardData.next(data)),
      map(data => data)
    );
  }

  getBranch(): Observable<string[]> {
    return this.http.get<any[]>('/api/hospital')
  }

  getDashboardOverview(data: any): Observable<any> {
    const branchId = Number(localStorage.getItem('branch'));
    console.log(branchId)
    return this.http.get<any>('/api/dashboard/overview', { params: { branchId: data.branchIds, startDate: data.startDate, endDate: data.endDate } }).pipe(
      tap(data => this._dashboardData.next(data)),
      map(data => data)
    );
  }

  getDashboard1() {
    return this.http.get<any>('https://asha-tech.co.th/thaicancel/public/api/dashboard/1/1/1/2567-01-01/2567-02-01',).pipe(
      tap(data => this._dashboardData.next(data)),
      map(data => data)
    );
  }
}
