import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  //#region Declare public Properties
  public createEmployeeForm: FormGroup;
  public employeelist: any[] = [];
  public departmentlist: any[] = [];
  public modalRef: BsModalRef;
  public selectedEmployeeId: number = 0;
  public isloading: boolean = false;
  public isSubmit: boolean = false;
  //#endregion

  //#region Template field declartion
  @ViewChild('addeditTemplate') public addeditTemplate: TemplateRef<any>;
  //#endregion

  constructor(private http: HttpClient,
    private modalService: BsModalService,
    private formBuilder: FormBuilder) {
    this.getDepartmentJSON().subscribe(res => {
      this.departmentlist = res;
    });
    this.getEmployeeJSON().subscribe(res => {
      if (res) {
        this.isloading = true;
        this.employeelist = res;
      }
    });

  }

  ngOnInit(): void {
    this.createEmployeeForm = new FormGroup({
      id: new FormControl(0),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email_address: new FormControl('', [Validators.email, Validators.required]),
      phone_number: new FormControl('', [Validators.required]),
      salary: new FormControl(''),
      departmentId: new FormControl('', [Validators.required]),
      bio: new FormControl(''),
      picture: new FormControl('')
    });
  }


  //#region  Get Call Methods
  public getDepartmentJSON(): Observable<any> {
    return this.http.get("../../assets/department.json");
  }

  public getEmployeeJSON(): Observable<any> {
    return this.http.get("../../assets/employee.json");
  }
  //#endregion

  //#region Click Methods

  public onsubmitclick() {
    if (this.createEmployeeForm.valid) {
      this.isSubmit = true;
      //this._spinnerService.show();
      var _employeeModel = this.createEmployeeForm.value;
      if (_employeeModel.id == 0) {
        _employeeModel.id = this.employeelist.length + 1;
      }
      else if (_employeeModel.id > 0) {
        this.employeelist.filter(x => x.id == _employeeModel.id);
        _employeeModel.id = this.selectedEmployeeId;
      }
      this.employeelist.push(_employeeModel);
      var theJSON = JSON.stringify(this.employeelist);
      const blob = new Blob([JSON.stringify(theJSON)], { type: 'application/json' });
      saveAs(blob, '../../assets/employee.json');

      //this._spinnerService.hide();

    }
  }

  public onDeleteClick(employeeId?: any) {
    this.employeelist = this.employeelist.filter(x => x.id == employeeId);       
  }

  //#endregion

  //#region Model Popup Open/close Method
  public onAddeditModelOpen(employeeId?: any) {
    if (employeeId != '0') {
      var objemployeedata = this.employeelist.find(x => x.id == employeeId);
      this.selectedEmployeeId = objemployeedata.id;
      this.createEmployeeForm.get('id').setValue(objemployeedata.id);
      this.createEmployeeForm.get('first_name').setValue(objemployeedata.first_name);
      this.createEmployeeForm.get('last_name').setValue(objemployeedata.last_name);
      this.createEmployeeForm.get('email_address').setValue(objemployeedata.email_address);
      this.createEmployeeForm.get('phone_number').setValue(objemployeedata.phone_number);
      this.createEmployeeForm.get('departmentId').setValue(objemployeedata.departmentId);
      this.createEmployeeForm.get('salary').setValue(objemployeedata.salary);
      this.createEmployeeForm.get('bio').setValue(objemployeedata.bio);
      this.createEmployeeForm.get('picture').setValue(objemployeedata.picture);
    }
    this.modalRef = this.modalService.show(this.addeditTemplate);
  }

  //#endregion

  //#region Validation Function
  public numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  //#endregion
}
