// import { Component, OnInit } from '@angular/core';
// import { CommonService } from 'app/@core/mock/common.service';
// import { LocalDataSource } from 'ng2-smart-table';
// //import { ClientService } from '../../../@core/mock/client.service';
// //import { CommonService } from '../../../@core/mock/common.service';

// @Component({
//   selector: 'ngx-client-transection',
//   templateUrl: './client-transection.component.html',
//   styleUrls: ['./client-transection.component.scss']
// })
// export class ClientTransectionComponent implements OnInit {

//   constructor(private commonService: CommonService) {
//   }
//   buttons = this.commonService.btnList

//   showList(){
//     alert('hi')
//   }

//   ngOnInit() {
//   }

// }

import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css";
import { AllCommunityModules, Module } from "@ag-grid-community/all-modules";

@Component({
  selector: "ngx-client-transection",
  templateUrl: "./client-transection.component.html",
  styleUrls: ["./client-transection.component.scss"],
})
export class ClientTransectionComponent {
  public gridApi;
  public gridColumnApi;

  public modules: Module[] = AllCommunityModules;
  public columnDefs;
  public defaultColDef;
  public rowData: any = [];

  constructor(private http: HttpClient) {
    this.columnDefs = [
      {
        headerName: "#",
        colId: "rowNum",
        valueGetter: "node.id",
        width: 80,
        pinned: "left"

      },
      {
        headerName: "Athlete",
        field: "athlete",
        width: 150,

      },
      {
        headerName: "Age",
        field: "age",
        width: 90,

      },
      {
        headerName: "Country",
        field: "country",
        width: 150,
      },
      {
        headerName: "Year",
        field: "year",
        width: 90,
      },
      {
        headerName: "Date",
        field: "date",
        width: 110,
      },
      {
        headerName: "Sport",
        field: "sport",
        width: 150,
      },
      {
        headerName: "Gold",
        field: "gold",
        width: 100,
      },
      {
        headerName: "Silver",
        field: "silver",
        width: 100,
      },
      {
        headerName: "Bronze",
        field: "bronze",
        width: 100,
      },
      {
        headerName: "Total",
        field: "total",
        width: 100,
      },
    ];
    this.defaultColDef = { resizable: true };
  }

  clear() {
    this.gridColumnApi.applyColumnState({ defaultState: { pinned: null } });
  }

  

  pin() {
    this.gridColumnApi.applyColumnState({
      state: [
        {
          colId: "rowNum",
          pinned: "left",
        },
      ],
      defaultState: { pinned: null },
    });
  }

   jumpToCol() {
  //   var value = document.getElementById("col").value;
  //   if (typeof value !== "string" || value === "") {
  //     return;
  //   }
  //   var index = Number(value);
  //   if (typeof index !== "number" || isNaN(index)) {
  //     return;
  //   }
  //   var allColumns = this.gridColumnApi.getAllColumns();
  //   var column = allColumns[index];
  //   if (column) {
  //     this.gridApi.ensureColumnVisible(column);
  //   }
   }

   jumpToRow(value) {
  //   var value = document.getElementById("row").value;
  //   var index = Number(value);
  //   if (typeof index === "number" && !isNaN(index)) {
  //     this.gridApi.ensureIndexVisible(index);
  //   }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.http
      .get("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        this.rowData = data;
      });
  }
}
