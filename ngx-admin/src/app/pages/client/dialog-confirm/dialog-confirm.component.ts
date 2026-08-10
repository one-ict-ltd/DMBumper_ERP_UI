import { Component, OnInit } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";

@Component({
  selector: "ngx-dialog-confirm",
  templateUrl: "./dialog-confirm.component.html",
  styleUrls: ["./dialog-confirm.component.scss"],
})
export class DialogConfirmComponent implements OnInit {
  names: any = {};
  constructor(protected ref: NbDialogRef<DialogConfirmComponent>) {
    this.names.message = 'Are you sure save data ?';
    this.names.value = 'save'
  }
  
  ngOnInit(): void {}
  cancel() {
    this.ref.close();
  }
  submit(name) {
    this.ref.close(name);
  }
}
