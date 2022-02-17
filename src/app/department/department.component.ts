import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { DepartmentService } from '../services/department.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  //#region Declare public Properties
  public createDepartmentForm: FormGroup;
  public departmentlist: any[] = [];
  public modalRef: BsModalRef;
  public selectedDepartmentId: number = 0;
  public isloading: boolean = false;
  public isSubmit: boolean = false;
  //#endregion

  //#region Template field declartion
  @ViewChild('addeditTemplate') public addeditTemplate: TemplateRef<any>;
  //#endregion

  constructor(private modalService: BsModalService,
    private _spinnerService: NgxSpinnerService,
    private departmentservice: DepartmentService) {
    localStorage.setItem('DEPARTMENTLIST', JSON.stringify(this.departmentlist));
  }

  ngOnInit(): void {
    this.createDepartmentForm = new FormGroup({
      id: new FormControl(0),
      department_name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required])
    });
  }

  //#region  Get Call Methods
  public getDepartmentList() {
    this.departmentlist = this.departmentservice.getDepartmentList();
  }
  //#endregion

  //#region Click Methods

  public onsubmitclick() {    
    if (this.createDepartmentForm.valid) {
      this.isSubmit = true;
      this._spinnerService.show();
      var _departmentModel = this.createDepartmentForm.value;
      if (_departmentModel.id == 0) {
        _departmentModel.id = this.departmentlist.length + 1;
        this.departmentlist =  this.departmentservice.saveDepartment(_departmentModel);
      }
      else if (_departmentModel.id > 0) {
        this.departmentlist.filter(x => x.id == _departmentModel.id);
        _departmentModel.id = this.selectedDepartmentId;
        this.departmentlist = this.departmentservice.updateDepartment(_departmentModel);
      }
      this.modalRef.hide();
      this.ngOnInit();
      this.createDepartmentForm.reset();
      this._spinnerService.hide();

    }
  }

  public onDeleteClick(departmentId?: any) {
    this.departmentlist = this.departmentservice.deleteDepartment(departmentId);    
  }

  //#endregion

  //#region Model Popup Open/close Method
  public onAddeditModelOpen(departmentId?: any) {
    if (departmentId != '0') {
      var objdepartmentdata = this.departmentlist.find(x => x.id == departmentId);
      this.selectedDepartmentId = objdepartmentdata.id;
      this.createDepartmentForm.get('id').setValue(objdepartmentdata.id);
      this.createDepartmentForm.get('department_name').setValue(objdepartmentdata.department_name);
      this.createDepartmentForm.get('description').setValue(objdepartmentdata.description);
    }
    this.modalRef = this.modalService.show(this.addeditTemplate);
  }

  //#endregion

}
