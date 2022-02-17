import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor() { }

  getEmployeeList() {
    return JSON.parse(localStorage.getItem('EMPLOYEELIST'));
  }

  saveEmployee(employeeObject: any) {
    let employeeList = JSON.parse(localStorage.getItem('EMPLOYEELIST'));
    employeeList.push(employeeObject);
    localStorage.setItem('EMPLOYEELIST', JSON.stringify(employeeList));
    return employeeList;
  }

  updatEemployee(employeeObject: any) {
    let employeeList = JSON.parse(localStorage.getItem('EMPLOYEELIST'));
    employeeList = employeeList.filter(x => x.id != employeeObject.id);
    employeeList.push(employeeObject);
    localStorage.setItem('EMPLOYEELIST', JSON.stringify(employeeList));
    return employeeList;
  }

  deleteEmployee(employeeId: number) {
    let employeeList = JSON.parse(localStorage.getItem('EMPLOYEELIST'));
    employeeList = employeeList.filter(x => x.id != employeeId);
    localStorage.setItem('EMPLOYEELIST', JSON.stringify(employeeList));
    return employeeList;
  }
}
