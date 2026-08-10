import { Component } from "@angular/core";

import { MENU_ITEMS } from "./pages-menu";
import { MenuService } from "../services/menu.service";
import { CommonService } from "app/@core/mock/common.service";

@Component({
  selector: "ngx-pages",
  styleUrls: ["pages.component.scss"],
  templateUrl: "./pages.component.html",
//   template: `
//     <ngx-one-column-layout>
//         <nb-menu [items]="menu"></nb-menu>
//       <router-outlet> </router-outlet>
//     </ngx-one-column-layout>
//   `,
})
export class PagesComponent {
  menu = [];
  settingsMenu = [];
  transectionmenu = [];
  reportmenu = [];

  showbody: any = true;

  
  constructor(
    private menuService: MenuService,
    private commonService: CommonService
  ) {
        // this.menu = [];
        
        // this.menuService.getMenu().subscribe((returns: any) => {
        //   if (returns.success) {
            
        //     console.log(returns.data);
        //     this.menu =returns.data
        //     this.menu.map((item) => {
        //       var data = this.menu.filter((x) => x.title == item.moduleName);

        //       if (data.length == 0) {
        //         this.menu.push({ title: item.moduleName, group: true });
        //       }

        //       this.menu.push({ title: item.title, children: item.children });
        //     });
        //     if (returns.data.length > 0) this.commonService.setUserGroup(returns.data[0].userGroupId);

        //     if (localStorage.getItem("userName") == "100000")
        //       this.showbody = false;

        //   }
        // });


        
    
  }
  // menu = MENU_ITEMS;

}
