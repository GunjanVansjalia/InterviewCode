import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor() { }

  getDepartmentList() {
    let departmentList = JSON.parse(localStorage.getItem('DEPARTMENTLIST'));    
    return departmentList;
  }

  saveDepartment(departmentobject: any) {
    let departmentList = JSON.parse(localStorage.getItem('DEPARTMENTLIST'));
    departmentList.push(departmentobject);
    localStorage.setItem('DEPARTMENTLIST', JSON.stringify(departmentList));
    return departmentList;    
  }

  updateDepartment(departmentobject: any) {
    let departmentList = JSON.parse(localStorage.getItem('DEPARTMENTLIST'));
    departmentList = departmentList.filter(x => x.id != departmentobject.id);
    departmentList.push(departmentobject);
    localStorage.setItem('DEPARTMENTLIST', JSON.stringify(departmentList)); 
    return departmentList;   
  }

  deleteDepartment(departmentId: number) {
    //Remove All Employee
    let employeeList = JSON.parse(localStorage.getItem('EMPLOYEELIST'));
    employeeList = employeeList.filter(x => x.departmentId != departmentId);
    localStorage.setItem('EMPLOYEELIST', JSON.stringify(employeeList));
    //Remove Department
    let departmentList = JSON.parse(localStorage.getItem('DEPARTMENTLIST'));
    departmentList = departmentList.filter(x => x.id != departmentId);
    localStorage.setItem('DEPARTMENTLIST', JSON.stringify(departmentList));  
    return departmentList;  
  }
}
