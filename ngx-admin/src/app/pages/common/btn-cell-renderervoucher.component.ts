import { Component, OnDestroy } from "@angular/core";
import { ICellRendererAngularComp } from "@ag-grid-community/angular";
import {
  ICellRendererParams,
  IAfterGuiAttachedParams,
} from "@ag-grid-community/all-modules";
import { CommonService } from "app/@core/mock/common.service";
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: "btn-cell-renderer",
  template: `
  <button ngIf="buttons[8].status" class="btn {{ buttons[8].class }} btn-sm float-right ml-1" (click)="btnClickedHandler($event)" value="{{buttons[8].value}}"><i class="{{ buttons[8].title }}" aria-hidden="true"></i></button>
  <button ngIf="buttons[23].status" class="btn {{ buttons[23].class }} btn-sm float-right ml-1" (click)="btnClickedHandler($event)" value="{{buttons[23].value}}"><i class="{{ buttons[23].title }}" aria-hidden="true"></i></button>
  <button ngIf="buttons[9].status" class="btn {{ buttons[9].class }} btn-sm float-right ml-1" (click)="btnClickedHandler($event)" value="{{buttons[9].value}}"><i class="{{ buttons[9].title }}" aria-hidden="true"></i></button>
  <button ngIf="buttons[18].status" class="btn {{ buttons[18].class }} btn-sm float-right ml-1" (click)="btnClickedHandler($event)" value="{{buttons[18].value}}"><i class="{{ buttons[18].title }}" aria-hidden="true"></i></button>
  <button ngIf="buttons[10].status" class="btn {{ buttons[10].class }} btn-sm float-right ml-1" (click)="btnClickedHandler($event)" value="{{buttons[10].value}}"><i class="{{ buttons[10].title }}" aria-hidden="true"></i></button>
  <button ngIf="buttons[11].status" class="btn {{ buttons[11].class }} btn-sm float-right ml-1" (click)="btnClickedHandler($event)" value="{{buttons[11].value}}"><i class="{{ buttons[11].title }}" aria-hidden="true"></i></button>
  `,
})
export class BtnCellRendererVoucher implements ICellRendererAngularComp, OnDestroy {
  constructor(private commonService: CommonService) { }
  buttons = this.commonService.btnList;

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams): void { }
  private params: any;

  agInit(params: any): void {
    this.params = params;
  }

  btnClickedHandler(event: any) {
    this.params.clicked(event.currentTarget.value);
    this.commonService.agButtonClicked = event.currentTarget.value;
    this.commonService.valueSet(event.currentTarget.value);
  }

  ngOnDestroy() {

  }
  onDeleteRow(event: any) {
    this.params.clicked(event.currentTarget.value);
  }
}
