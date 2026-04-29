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

  public getAllDepartments(): Observable<Department[]> {
    const url = DepartmentActionEnum.toUrl(DepartmentActionEnum.GET);
    return this.http.get<Department[]>(url);
  }

  public getDepartment(id: string): Observable<Department> {
    const url = DepartmentActionEnum.toUrl(DepartmentActionEnum.GET, id);
    return this.http.get<Department>(url);
  }

  public createDepartment(department: Department): Observable<Department> {
    const url = DepartmentActionEnum.toUrl(DepartmentActionEnum.CREATE);
    return this.http.post<Department>(url, department);
  }

  public updateDepartment(departmentId: string, department: Department): Observable<Department> {
    const url = DepartmentActionEnum.toUrl(DepartmentActionEnum.UPDATE, departmentId);
    return this.http.put<Department>(url, department);
  }

  public deleteDepartment(id: string) {
    const url = DepartmentActionEnum.toUrl(DepartmentActionEnum.DELETE, id);
    return this.http.delete(url);
  }
}
