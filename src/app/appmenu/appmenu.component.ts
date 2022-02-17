import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-appmenu',
  templateUrl: './appmenu.component.html',
  styleUrls: ['./appmenu.component.scss']
})
export class AppmenuComponent implements OnInit {
  opendepartmentcompo:boolean = true;
  constructor() { }

  ngOnInit(): void {
  }
  

  opencomponent(name:string){
    
    if(name == "department"){
      this.opendepartmentcompo = true;
    }
    else{
      this.opendepartmentcompo = false;
    }
  }
}
