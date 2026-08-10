import { Component, OnInit } from '@angular/core';
import { CommonService } from 'app/@core/mock/common.service';

@Component({
  selector: 'ngx-grid-button',
  templateUrl: './grid-button.component.html',
  styleUrls: ['./grid-button.component.scss']
})
export class GridButtonComponent implements OnInit {

  constructor(private commonService: CommonService) { }
  buttons = this.commonService.btnList;
  buttonClicked = "";
  ngOnInit(): void {
  }

  valueSet(value: any) {
    //debugger;
    if (value == "view") {
      this.buttons[0].status = false; // create
      this.buttons[1].status = true; // reset
      this.buttons[2].status = false; // save
      this.buttons[3].status = false; // update
      this.buttons[4].status = false; // approve
      this.buttons[5].status = false; // decline
      this.buttons[6].status = true; // showlist
      this.buttons[7].status = false; // report
    } else if (value == "edit") {
      this.buttons[0].status = false; // create
      this.buttons[1].status = true; // reset
      this.buttons[2].status = false; // save
      this.buttons[3].status = true; // update
      this.buttons[4].status = false; // approve
      this.buttons[5].status = false; // decline
      this.buttons[6].status = true; // showlist
      this.buttons[7].status = false; // report
    }
    // } else if (value == "save") {
    //   this.buttons[0].status = true; // create
    //   this.buttons[1].status = false; // reset
    //   this.buttons[2].status = false; // save
    //   this.buttons[3].status = false; // update
    //   this.buttons[4].status = false; // approve
    //   this.buttons[5].status = false; // decline
    //   this.buttons[6].status = false; // showlist
    //   this.buttons[7].status = true; // report
    // } else if (value == "update") {
    //   this.buttons[0].status = true; // create
    //   this.buttons[1].status = false; // reset
    //   this.buttons[2].status = false; // save
    //   this.buttons[3].status = false; // update
    //   this.buttons[4].status = false; // approve
    //   this.buttons[5].status = false; // decline
    //   this.buttons[6].status = false; // showlist
    //   this.buttons[7].status = true; // report
    // } else if (value == "approve") {
    //   this.buttons[0].status = true; // create
    //   this.buttons[1].status = false; // reset
    //   this.buttons[2].status = false; // save
    //   this.buttons[3].status = false; // update
    //   this.buttons[4].status = false; // approve
    //   this.buttons[5].status = false; // decline
    //   this.buttons[6].status = false; // showlist
    //   this.buttons[7].status = true; // report
    // } else if (value == "decline") {
    //   this.buttons[0].status = true; // create
    //   this.buttons[1].status = false; // reset
    //   this.buttons[2].status = false; // save
    //   this.buttons[3].status = false; // update
    //   this.buttons[4].status = false; // approve
    //   this.buttons[5].status = false; // decline
    //   this.buttons[6].status = false; // showlist
    //   this.buttons[7].status = true; // report
    // }
    this.commonService.buttonClicked = value;
    this.buttonClicked = value;
  }
}
