import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { CommonService } from "../../../@core/mock/common.service";
import {
  NbSortDirection,
  NbSortRequest,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
} from "@nebular/theme";


interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  name: string;
  size: string;
  kind: string;
  items?: number;
}

@Component({
  selector: "ngx-accountledger",
  templateUrl: "./accountledger.component.html",
  styleUrls: ["./accountledger.component.scss"],
})
export class AccountledgerComponent {
  customColumn = "name";
  defaultColumns = ["size", "kind", "items"];
  allColumns = [this.customColumn, ...this.defaultColumns];

  dataSource: NbTreeGridDataSource<FSEntry>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  company: {
    name: string;
    custom_footer: boolean;
    address: string;
    phone: string;
    fax: string;
    email: string;
    website: string;
    vat: string;
    tin: string;
  };
  htmlData: any;

  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private commonService: CommonService
  ) {
    this.dataSource = this.dataSourceBuilder.create(this.data);

    //One Information and Communications Technology Ltd. 14/A, Center Point Concord Unit-10A & B Tejgaon, Dhaka - 1215
    this.company = {
      name: "One Information and Communications Technology Ltd",
      address: "14/A, Center Point Concord Unit-10A & B Tejgaon, Dhaka - 1215",
      custom_footer: true,
      phone: "01704-055668",
      fax: "02-98765432",
      email: "info@one-ict.com",
      website: "www.one-ict.com",
      vat: "13145664564",
      tin: "00000000000",
    };

  }

  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

  private data: TreeNode<FSEntry>[] = [
    {
      data: { name: "Projects", size: "1.8 MB", items: 5, kind: "dir" },
      children: [
        {
          data: { name: "project-1.doc", kind: "doc", size: "240 KB" },
          children: [
            { data: { name: "Section-1.doc", kind: "doc", size: "240 KB" } },
            { data: { name: "Section-2.doc", kind: "doc", size: "290 KB" } },
            { data: { name: "Section-3", kind: "txt", size: "466 KB" } },
            { data: { name: "Section-4.docx", kind: "docx", size: "900 KB" } },
          ],
        },
        {
          data: { name: "project-2.doc", kind: "doc", size: "290 KB" },
          children: [
            { data: { name: "Section-1.doc", kind: "doc", size: "240 KB" } },
            { data: { name: "Section-2.doc", kind: "doc", size: "290 KB" } },
            { data: { name: "Section-3", kind: "txt", size: "466 KB" } },
            { data: { name: "Section-4.docx", kind: "docx", size: "900 KB" } },
          ],
        },
        {
          data: { name: "project-3", kind: "txt", size: "466 KB" },
          children: [
            { data: { name: "Section-1.doc", kind: "doc", size: "240 KB" } },
            { data: { name: "Section-2.doc", kind: "doc", size: "290 KB" } },
            { data: { name: "Section-3", kind: "txt", size: "466 KB" } },
            { data: { name: "Section-4.docx", kind: "docx", size: "900 KB" } },
          ],
        },
        {
          data: { name: "project-4.docx", kind: "docx", size: "900 KB" },
          children: [
            { data: { name: "Section-1.doc", kind: "doc", size: "240 KB" } },
            { data: { name: "Section-2.doc", kind: "doc", size: "290 KB" } },
            { data: { name: "Section-3", kind: "txt", size: "466 KB" } },
            { data: { name: "Section-4.docx", kind: "docx", size: "900 KB" } },
          ],
        },
      ],
    },
    {
      data: { name: "Reports", kind: "dir", size: "400 KB", items: 2 },
      children: [
        { data: { name: "Report 1", kind: "doc", size: "100 KB" } },
        { data: { name: "Report 2", kind: "doc", size: "300 KB" } },
      ],
    },
    {
      data: { name: "Other", kind: "dir", size: "109 MB", items: 2 },
      children: [
        { data: { name: "backup.bkp", kind: "bkp", size: "107 MB" } },
        { data: { name: "secret-note.txt", kind: "txt", size: "2 MB" } },
      ],
    },
  ];

  public getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + nextColumnStep * index;
  }

  @ViewChild("pdfTable", { static: false }) pdfTable: ElementRef;
  public captureScreen(fileName: any) {
    var data = document.getElementById(fileName);
    //this.commonService.getPdf(data, fileName);
  }

  // //PDF genrate button click function
  // public downloadAsPDF() {
  //   const doc = new jsPDF();
  //   //get table html
  //   const pdfTable = this.pdfTable.nativeElement;
  //   //html to pdf format
  //   var html = htmlToPdfmake(pdfTable.innerHTML);

  //   const documentDefinition = { content: html };
  //   pdfMake.createPdf(documentDefinition).open();
  // } 

}

@Component({
  selector: "ngx-fs-icon",
  template: `
    <nb-tree-grid-row-toggle
      [expanded]="expanded"
      *ngIf="isDir(); else fileIcon"
    >
    </nb-tree-grid-row-toggle>
    <ng-template #fileIcon>
      <nb-icon icon="file-text-outline"></nb-icon>
    </ng-template>
  `,
})
export class FsIconComponent {
  @Input() kind: string;
  @Input() expanded: boolean;

  isDir(): boolean {
    return this.kind === "dir";
  }
}
