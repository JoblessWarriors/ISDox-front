import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DepartmentActionEnum } from './department-action-enum';
import { Department } from '../../model/department/department.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private http = inject(HttpClient);

  public getDepartments(): Observable<Department[]> {
    const url = DepartmentActionEnum.toUrl(DepartmentActionEnum.GET);
    return this.http.get<Department[]>(url);
  }
}
