import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from 'app/services/menu.service';
import { CommonService } from "app/@core/mock/common.service";
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  templateUrl: "./one-column.layout.html",
})



export class OneColumnLayoutComponent {
  showbody: any = true;
  lastSelectedMenu: any = null;
  lastSelectedLink: string | null = null;
  menu = [];
  moduleList = [];
  setteingList = [];
  TransectionList = [];

  // menu-data.ts
  menuData_format = [
    {
      name: 'Settings',
      open: false, // Initially closed
      subcategories: [
        {
          name: 'HRM',
          open: false, // Initially closed
          subsubcategories: [
            {
              name: 'Basic',
              open: false, // Initially closed
              categories: [
                {
                  "title": "Menu",
                  "link": "#/pages/settings/menus"
                },
                {
                  "title": "User Group",
                  "link": "#/pages/settings/usergroup"
                },
                // Add more categories as needed
              ],
            },
            {
              name: 'Employee Setting',
              open: false, // Initially closed
              categories: [

                // Add more categories as needed
              ],
            },
            // Add more sub-subcategories as needed
          ],
        },
        {
          name: 'Subcategory 1.2',
          open: false, // Initially closed
          subsubcategories: [
            {
              name: 'Sub-subcategory 1.2.1',
              open: false, // Initially closed
              categories: [

                // Add more categories as needed
              ],
            },
            {
              name: 'Sub-subcategory 1.2.2',
              open: false, // Initially closed
              categories: [
                'Category 1.2.2.1',
                'Category 1.2.2.2',
                // Add more categories as needed
              ],
            },
            // Add more sub-subcategories as needed
          ],
        },
        // Add more subcategories as needed
      ],
    },
    {
      name: 'Transection',
      open: false, // Initially closed
      subcategories: [
        {
          name: 'Subcategory 2.1',
          open: false, // Initially closed
          subsubcategories: [
            {
              name: 'Sub-subcategory 2.1.1',
              open: false, // Initially closed
              categories: [
                'Category 2.1.1.1',
                'Category 2.1.1.2',
                // Add more categories as needed
              ],
            },
            {
              name: 'Sub-subcategory 2.1.2',
              open: false, // Initially closed
              categories: [
                'Category 2.1.2.1',
                'Category 2.1.2.2',
                // Add more categories as needed
              ],
            },
            // Add more sub-subcategories as needed
          ],
        },
        {
          name: 'Subcategory 2.2',
          open: false, // Initially closed
          subsubcategories: [
            {
              name: 'Sub-subcategory 2.2.1',
              open: false, // Initially closed
              categories: [
                'Category 2.2.1.1',
                'Category 2.2.1.2',
                // Add more categories as needed
              ],
            },
            {
              name: 'Sub-subcategory 2.2.2',
              open: false, // Initially closed
              categories: [
                'Category 2.2.2.1',
                'Category 2.2.2.2',
                // Add more categories as needed
              ],
            },
            // Add more sub-subcategories as needed
          ],
        },
        // Add more subcategories as needed
      ],
    },
    // Add more menus as needed
  ];

  menuData = [
    {
      name: 'Settings',
      open: false, // Initially closed
      subcategories: [],
      isVisible: false
    },
    {
      name: 'Transaction',
      open: false, // Initially closed
      subcategories: [],
      isVisible: false
    },
    // Add more menus as needed
    {
      name: 'Reports',
      open: false, // Initially closed
      subcategories: [],
      isVisible: false
    },
  ];


  constructor(
    private menuService: MenuService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private cs: CommonService,
    private ts: NbToastrService,
    // private router: Router
  ) {
    this.menu = []; // Settings
    this.moduleList = []; // Module
    this.menuService.getMenu().subscribe((returns: any) => {
      //  this.menuService.getUserWiseMenu().subscribe((returns: any) => {
      if (returns.success) {
        // debugger
        // console.log(returns.data);
        var menuList = returns.data;
        this.menuData.forEach((masterMenu) => {
          this.menu = [];
          this.moduleList = [];

          // Get ALl Moudule List
          if (masterMenu.name == "Settings") {
            this.menu = menuList.filter((x) => x.menuTypeId == 3);
          } else if (masterMenu.name == "Transaction") {
            this.menu = menuList.filter((x) => x.menuTypeId == 4);
          } else if (masterMenu.name == "Reports") {
            this.menu = menuList.filter((x) => x.menuTypeId == 2);
          }

          // Get ALl Sub-Moudule List
          this.menu.forEach((item) => {
            var module = this.moduleList.filter((x) => x.name == item.moduleName);
            if (module.length == 0) {
              this.moduleList.push({ name: item.moduleName, open: false });
            }
          });
          // From module get Parent Items and childrens
          this.moduleList.forEach((module) => {
            let subsubcategories = []
            let moduleWiseSubcategories = this.menu.filter((x) => x.moduleName == module.name);
            moduleWiseSubcategories.forEach((parenteMenu) => {
              var menu = subsubcategories.filter((x) => x.name == parenteMenu.title);
              if (menu.length == 0) {
                subsubcategories.push({ name: parenteMenu.title, open: false, categories: parenteMenu.children });
              }
            })
            if (subsubcategories.length > 0) {
              module.subsubcategories = subsubcategories;

            }
          });

          if (this.moduleList.length > 0) {
            masterMenu.isVisible = true;
            masterMenu.subcategories = this.moduleList;
          }
        });


        this.menuData = this.menuData.filter(x => x.isVisible == true);
        // console.log(this.menuData);

        // var settingMenuList = menuList.filter((x) => x.menuTypeId == 3);
        // console.log("Settings: ",returns.data);
        // settingMenuList.forEach((item) => {
        //   var module = this.moduleList.filter((x) => x.name == item.moduleName);
        //   if (module.length == 0) {
        //     this.moduleList.push({ name: item.moduleName, open: false});
        //   }
        // });


        // this.moduleList.forEach((module) => {
        //   let subsubcategories = []
        //   let moduleWiseSubcategories = settingMenuList.filter((x) => x.moduleName == module.name);
        //   // Get ALl Sub Moudule List
        //   moduleWiseSubcategories.forEach((parenteMenu) => {
        //     var menu = subsubcategories.filter((x) => x.name == parenteMenu.title );
        //     if (menu.length == 0) {
        //       subsubcategories.push({ name: parenteMenu.title, open: false, categories:parenteMenu.children});
        //     }
        //   })
        //   console.log("subcategories: ",subsubcategories);
        //   // Add all Menus Under menulist
        //   if(subsubcategories.length>0){
        //     module.subsubcategories = subsubcategories;
        //     module.menuType = "Settings";
        //   }
        // });
        // console.log("moduleList: ",this.moduleList);

        // this.menuData.forEach((moduleItem) => {
        //   if(moduleItem.name == "Settings"){
        //     moduleItem.subcategories = this.moduleList;
        //   }

        // });


        //debugger;
        if (returns.data.length > 0) this.commonService.setUserGroup(returns.data[0].userGroupId);

        if (localStorage.getItem("userName") == "100000")
          this.showbody = false;

      }
      else {
        //this.ts.warning(returns.message, "Warning");
        if (confirm("Your session expired! Do you want to logout?")) {
          localStorage.clear();
          this.router.navigate([`auth/login`]);
        }
      }
    });

  }


  toggleMenu(menu: any) {
    // menu.open = !menu.open;
    this.menuData.forEach((otherMenu) => {
      if (otherMenu !== menu) {
        otherMenu.open = false;
      }
    });

    // Toggle the selected menu
    menu.open = !menu.open;
    this.lastSelectedMenu = menu;
    this.checkTokenStatus();
  }

  toggleSubcategory(menu: any, parentMenuList: any) {
    parentMenuList.forEach((otherMenu) => {
      if (otherMenu !== menu) {
        otherMenu.open = false;
      }
    });
    menu.open = !menu.open;
    this.checkTokenStatus();
  }

  // toggleSubsubcategory(menu: any) {
  //   menu.open = !menu.open;
  // }

  toggleSubsubcategory(menu: any, parentMenuList: any) {
    parentMenuList.forEach((otherMenu) => {
      if (otherMenu !== menu) {
        otherMenu.open = false;
      }
    });
    menu.open = !menu.open;
    this.checkTokenStatus();
  }


  // ... Other methods ...

  setLastSelectedLink(link: string) {
    //debugger
    this.lastSelectedLink = link;
    this.checkTokenStatus();
  }

  checkTokenStatus() {
    // console.log('checkLogin: ', 'Hit');
    let isLogin = localStorage.getItem("isLogin");
    //console.log('isLogin : ', isLogin);
    if (isLogin == "true") {
      let api = "Login/ValidateTheToken";
      this.cs.postApiData(api, {}).subscribe((returns: any) => {
        if (!returns.success) {
          console.log('checkLogin: ', returns);
          //this.ts.warning(returns.message, "Warning");
          if (confirm("Your session expired! Do you want to login again?")) {
            localStorage.clear();
            this.router.navigate([`auth/login`]);
          }
        }
      });
    }
  }
}

// showbody: boolean = true; *ngIf="showbody?true:false"