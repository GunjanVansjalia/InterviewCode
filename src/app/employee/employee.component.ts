import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeService } from '../services/employee.service';
import { DepartmentService } from '../services/department.service';


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
  public imageUrl: string;  
  //#endregion

  //#region Template field declartion
  @ViewChild('addeditTemplate') public addeditTemplate: TemplateRef<any>;
  //#endregion

  constructor(private modalService: BsModalService,
    private _spinnerService: NgxSpinnerService,
    private employeeservice: EmployeeService,
    private departmentservice: DepartmentService) {
    localStorage.setItem('EMPLOYEELIST', JSON.stringify(this.employeelist));
  }

  ngOnInit(): void {
    //#region  get Call Methods
    this.getDepartmentList();
    this.getEmployeeList();
    //#endregion

    this.createEmployeeForm = new FormGroup({
      id: new FormControl(0),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email_address: new FormControl('', [Validators.email, Validators.required]),
      phone_number: new FormControl('', [Validators.required]),
      salary: new FormControl(''),
      departmentId: new FormControl('', [Validators.required]),
      departmentName:new FormControl(''),
      bio: new FormControl(''),
      picture: new FormControl('')
    });
  }


  //#region  Get Call Methods
  public getDepartmentList() {
    this.departmentlist = this.departmentservice.getDepartmentList();
  }

  public getEmployeeList() {
    this.employeelist = this.employeeservice.getEmployeeList();
  }  
  //#endregion

  //#region Click Methods

  public onsubmitclick() {
    if (this.createEmployeeForm.valid) {
      this.isSubmit = true;
      this._spinnerService.show();      
      var _employeeModel = this.createEmployeeForm.value;
      _employeeModel.departmentName = this.departmentlist.find(x=>x.id == _employeeModel.departmentId).department_name;
      
      if (_employeeModel.id == 0) {
        _employeeModel.id = this.employeelist.length + 1;
        this.employeelist = this.employeeservice.saveEmployee(_employeeModel);
      }
      else if (_employeeModel.id > 0) {
        this.employeelist.filter(x => x.id == _employeeModel.id);
        _employeeModel.id = this.selectedEmployeeId;
        this.employeelist = this.employeeservice.updatEemployee(_employeeModel);
      }
      this.modalRef.hide();
      this.ngOnInit();
      this.createEmployeeForm.reset();
      this._spinnerService.hide();

    }
  }

  public onDeleteClick(employeeId?: any) {
    this.employeelist = this.employeeservice.deleteEmployee(employeeId);
  }

  //#endregion

  //#region File Upload Methods
  public byteArrayTobase64(arr: any[]) {
    let base64: string = "";
    for (var i = 0; i < arr.length; i++) {
      base64 += String.fromCharCode(arr[i]);
    }
    return window.btoa(base64);
  }

  public FileConvertintoBytearray(file, cb) { // making File to Array Bytes    
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onloadend = function () {
      const arrayBuffer: any = fileReader.result;
      const bytes = new Uint8Array(arrayBuffer);
      const array_bytes = Array.from(bytes);
      file.bytes = array_bytes;
      cb(file);
    };
  }
  public handleFileInput(files: FileList) {
    this.FileConvertintoBytearray(files.item(0), async (f) => { // creating array bytes
      this.createEmployeeForm.patchValue({
        picture: this.byteArrayTobase64(f.bytes)
      });
    });
  }

  //#endregion
  //#region Model Popup Open/close Method
  public onAddeditModelOpen(employeeId?: any) {
    this.departmentlist = this.departmentservice.getDepartmentList();
    if (employeeId != '0') {
      var objemployeedata = this.employeelist.find(x => x.id == employeeId);
      this.selectedEmployeeId = objemployeedata.id;
      this.imageUrl = "data:image/png;base64," + objemployeedata.picture;
      this.createEmployeeForm.patchValue({
        id: objemployeedata.id,
        first_name: objemployeedata.first_name,
        last_name: objemployeedata.last_name,
        email_address: objemployeedata.email_address,
        phone_number: objemployeedata.phone_number,
        departmentId: objemployeedata.departmentId,
        departmentName: objemployeedata.departmentName,
        salary: objemployeedata.salary,
        bio: objemployeedata.bio,
        picture: objemployeedata.picture
      });
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
