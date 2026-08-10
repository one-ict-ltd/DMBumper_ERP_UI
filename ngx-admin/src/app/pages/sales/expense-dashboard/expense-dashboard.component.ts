import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { CommonService } from 'app/@core/mock/common.service';
import * as Chart from 'chart.js';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'ngx-expense-dashboard',
  templateUrl: './expense-dashboard.component.html',
  styleUrls: ['./expense-dashboard.component.scss']
})
export class ExpenseDashboardComponent implements OnInit {
  canvas: any;
  ctx: any;
  apiUrl: string = null;
  regionList: any[];
  territoryList: any[];
  areaList: any[];
  regionCode: string = "";
  zoneCode: string = "";
  areaCode: string = "";
  regionSelected: any = {};
  areaSelected: any = {};
  territoryCode: string = "";
  expenseLocationId: string = "";
  nationalExpenseLocationId: string = "";
  territorySelected: any = {};
  expenseLocationTypeSelected: any = { "id": "Z", "name": "Zone" };

  expenseCategoryTypeSelected: any = { "id": "Z", "name": "Zone" };

  nationalExpenseLocationTypeSelected: any = {};
  fDate: Date = new Date(new Date().getFullYear(), 0, 1);
  tDate: Date = new Date();
  fDateEL: Date = new Date(new Date().getFullYear(), 0, 1);
  tDateEL: Date = new Date();
  fDateEC: Date = new Date(new Date().getFullYear(), 0, 1);
  tDateEC: Date = new Date();
  expenseLocationDdSelected: any = null;
  nationalExpenseComparisonSelected: any = null;
  costHeadFilterSelected: any = null;
  depotOverviewFilterSelected: any = null;
  expenseCategoryFilterSelected: any = null;
  isDetailsOfLocationWiseExpense: boolean = false;
  isDetailsOfCategoryWiseExpense: boolean = false;
  isDetailsOfDepotOverview: boolean = false;
  isDeptotOverViewList: boolean = false;
  isExpenseCategoryList: boolean = false;
  isDetails: boolean = false;

  isShowZone: boolean = true;
  isShowRegion: boolean = true;
  isShowArea: boolean = true;
  isShowTerritory: boolean = true;

  isShowZoneEL: boolean = true;
  isShowRegionEL: boolean = true;
  isShowAreaEL: boolean = true;
  isShowTerritoryEL: boolean = true;

  // for expense category
  isShowZoneEC: boolean = true;
  isShowRegionEC: boolean = true;
  isShowAreaEC: boolean = true;
  isShowTerritoryEC: boolean = true;

  expenseLocation: string = "Zone";
  // for expense location
  regionListEL: any[];
  areaListEL: any[];
  territoryListEL: any[];
  regionSelectedEL: any = {};
  areaSelectedEL: any = {};
  territorySelectedEL: any = {};

  // for expense category
  regionListEC: any[];
  areaListEC: any[];
  territoryListEC: any[];
  regionSelectedEC: any = {};
  areaSelectedEC: any = {};
  territorySelectedEC: any = {};

  customYearSelected: any = {};

  regionCodeEL: string = "";
  zoneCodeEL: string = "";
  areaCodeEL: string = "";
  territoryCodeEL: string = "";

  regionCodeEC: string = "";
  zoneCodeEC: string = "";
  areaCodeEC: string = "";
  territoryCodeEC: string = "";

  thisYear: number = new Date().getFullYear();
  lastYear: number = this.thisYear - 1;
  YearFilterList = [{ "id": this.thisYear, "name": "This Year" }, { "id": this.lastYear, "name": "Last Year" }];

  //cost head variables
  customYear: number = null;
  isCostHeadCustomYear: boolean = false;
  costHeadCustomYearSelected: any = {};

  //depot overview variables
  isCustomYearDepotOverview: boolean = false;
  customYearDepotOverview: number = null;
  customYearSelectedDepotOverview: any = {};

  //expense category variables
  isCustomYearExpenseCategory: boolean = false;
  customYearExpenseCategory: number = null;
  customYearSelectedExpenseCategory: any = {};



  constructor(private dialogService: NbDialogService,
    private commonService: CommonService
  ) {
    //this.getNationalExpenseComparison();
    this.getNationalExpeseSumamry();
    this.getLocationWiseExpense();
    this.GetAllZone();
    this.GetAllZoneEL();
    this.GetAllZoneEC();
    this.getNationalExpenseComparisonMonthly();
    this.getDepotOverview();
    this.getcategoryOverview();
  }
  ngOnInit() {

    setTimeout(() => {
      this.initializeCharts();
    }, 10);
  }

  public OpenModal(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      context: [], //this.data,
    });
  }


  /*
  drop dpwns
   */
  zoneList: any[];
  zoneSelected = {};
  public GetAllZone() {
    this.zoneSelected = {};
    this.regionSelected = {};
    this.areaSelected = {};
    this.territorySelected = {};

    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetZone`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.zoneList = returns.data.map((val: any) => ({
          id: val.ZoneCode,
          name: val.ZoneName,
        }));
        if (this.zoneList.length == 1) {
          this.zoneSelected = {
            id: this.zoneList[0].id,
            name: this.zoneList[0].name,
          };
        }
      }
    });
  }
  zoneListEL: any[];
  zoneSelectedEL = {};
  public GetAllZoneEL() {
    this.zoneSelectedEL = {};
    this.regionSelectedEL = {};
    this.areaSelectedEL = {};
    this.territorySelectedEL = {};

    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetZone`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.zoneListEL = returns.data.map((val: any) => ({
          id: val.ZoneCode,
          name: val.ZoneName,
        }));
        if (this.zoneListEL.length == 1) {
          this.zoneSelected = {
            id: this.zoneListEL[0].id,
            name: this.zoneListEL[0].name,
          };
        }
      }
    });
  }

  GetAllRegion() {
    this.regionList = [];
    this.regionCode = "";
    this.apiUrl = "";

    if (this.zoneSelected && Object.keys(this.zoneSelected).length > 0) {
      const zoneArray = Object.values(this.zoneSelected) as { id: string; name: string }[];

      const zoneCodes = zoneArray.map((zone) => zone.id).join(',');
      this.zoneCode = zoneCodes;
      this.apiUrl = `CmnDropDown/GetRegionByZoneCodes?zoneCodes=${zoneCodes}`;
      this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
        if (returns.success) {
          this.regionList = returns.data.map((val: any) => ({
            id: val.code,
            name: val.name,
          }));
        }
      });
    } else {
      this.areaSelected = {};
      this.regionSelected = {};
      this.territorySelected = {};
      console.warn('No zones selected.');
    }
  }
  GetAllRegionEL() {
    this.regionListEL = [];
    this.regionCodeEL = "";
    this.apiUrl = "";

    if (this.zoneSelected && Object.keys(this.zoneSelectedEL).length > 0) {
      const zoneArray = Object.values(this.zoneSelectedEL) as { id: string; name: string }[];

      const zoneCodes = zoneArray.map((zone) => zone.id).join(',');
      this.zoneCodeEL = zoneCodes;
      this.apiUrl = `CmnDropDown/GetRegionByZoneCodes?zoneCodes=${zoneCodes}`;
      this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
        if (returns.success) {
          this.regionListEL = returns.data.map((val: any) => ({
            id: val.code,
            name: val.name,
          }));
        }
      });
    } else {
      this.areaSelectedEL = {};
      this.regionSelectedEL = {};
      this.territorySelectedEL = {};
      console.warn('No zones selected.');
    }
  }
  zoneListEC: any[];
  zoneSelectedEC = {};
  public GetAllZoneEC() {
    this.zoneSelectedEC = {};
    this.regionSelectedEC = {};
    this.areaSelectedEC = {};
    this.territorySelectedEC = {};

    this.apiUrl = "";
    this.apiUrl = `SalesInvoice/GetZone`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.zoneListEC = returns.data.map((val: any) => ({
          id: val.ZoneCode,
          name: val.ZoneName,
        }));
        if (this.zoneListEC.length == 1) {
          this.zoneSelectedEC = {
            id: this.zoneListEL[0].id,
            name: this.zoneListEL[0].name,
          };
        }
      }
    });
  }

  GetAllRegionEC() {
    this.regionListEC = [];
    this.regionCodeEC = "";
    this.apiUrl = "";

    if (this.zoneSelectedEC && Object.keys(this.zoneSelectedEC).length > 0) {
      const zoneArray = Object.values(this.zoneSelectedEC) as { id: string; name: string }[];

      const zoneCodes = zoneArray.map((zone) => zone.id).join(',');
      this.zoneCodeEC = zoneCodes;
      this.apiUrl = `CmnDropDown/GetRegionByZoneCodes?zoneCodes=${zoneCodes}`;
      this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
        if (returns.success) {
          this.regionListEC = returns.data.map((val: any) => ({
            id: val.code,
            name: val.name,
          }));
        }
      });
    } else {
      this.areaSelectedEC = {};
      this.regionSelectedEC = {};
      this.territorySelectedEC = {};
      console.warn('No zones selected.');
    }
  }
  getAllAreaEC() {
    this.regionCodeEC = "";
    this.territorySelectedEC = {};
    this.apiUrl = "";

    if (this.regionSelectedEC && Object.keys(this.regionSelectedEC).length > 0) {
      const regionArray = Object.values(this.regionSelectedEC) as { id: string; name: string }[];

      const regionCodes = regionArray.map((zone) => zone.id).join(',');
      this.regionCodeEC = regionCodes;
      this.apiUrl = `CmnDropDown/GetAreaByRegionCodes?regionCodes=${regionCodes}`;
      this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
        if (returns.success) {
          this.areaListEC = returns.data.map((val: any) => ({
            id: val.code,
            name: val.name,
          }));
        }
      });
    } else {
      this.areaSelectedEC = {};
      alert('No region selected.');
    }
  }

  getAllArea() {
    this.regionCode = "";
    this.territorySelected = {};
    this.apiUrl = "";

    if (this.regionSelected && Object.keys(this.regionSelected).length > 0) {
      const regionArray = Object.values(this.regionSelected) as { id: string; name: string }[];

      const regionCodes = regionArray.map((zone) => zone.id).join(',');
      this.regionCode = regionCodes;
      this.apiUrl = `CmnDropDown/GetAreaByRegionCodes?regionCodes=${regionCodes}`;
      this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
        if (returns.success) {
          this.areaList = returns.data.map((val: any) => ({
            id: val.code,
            name: val.name,
          }));
        }
      });
    } else {
      this.areaSelected = {};
      alert('No region selected.');
    }
  }
  getAllAreaEL() {
    this.regionCodeEL = "";
    this.territorySelectedEL = {};
    this.apiUrl = "";

    if (this.regionSelected && Object.keys(this.regionSelectedEL).length > 0) {
      const regionArray = Object.values(this.regionSelectedEL) as { id: string; name: string }[];

      const regionCodes = regionArray.map((zone) => zone.id).join(',');
      this.regionCodeEL = regionCodes;
      this.apiUrl = `CmnDropDown/GetAreaByRegionCodes?regionCodes=${regionCodes}`;
      this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
        if (returns.success) {
          this.areaListEL = returns.data.map((val: any) => ({
            id: val.code,
            name: val.name,
          }));
        }
      });
    } else {
      this.areaSelectedEL = {};
      alert('No region selected.');
    }
  }
  getAllTerritory() {
    this.territoryCode = "";
    this.apiUrl = "";

    if (this.areaSelected && Object.keys(this.areaSelected).length > 0) {
      const areaArray = Object.values(this.areaSelected) as { id: string; name: string }[];

      const areaCodes = areaArray.map((zone) => zone.id).join(',');
      this.areaCode = areaCodes;
      this.apiUrl = `CmnDropDown/GetTerritoryByAreaCodes?areaCodes=${this.areaCode}`;
      this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
        if (returns.success) {
          this.territoryList = returns.data.map((val: any) => ({
            id: val.code,
            name: val.name,
          }));
        }
      });
    } else {
      this.territorySelected = {};
      alert('No area selected.');
    }
  }
  getAllTerritoryEL() {
    this.territoryCodeEL = "";
    this.apiUrl = "";

    if (this.areaSelectedEL && Object.keys(this.areaSelectedEL).length > 0) {
      const areaArray = Object.values(this.areaSelectedEL) as { id: string; name: string }[];

      const areaCodes = areaArray.map((zone) => zone.id).join(',');
      this.areaCodeEL = areaCodes;
      this.apiUrl = `CmnDropDown/GetTerritoryByAreaCodes?areaCodes=${this.areaCode}`;
      this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
        if (returns.success) {
          this.territoryListEL = returns.data.map((val: any) => ({
            id: val.code,
            name: val.name,
          }));
        }
      });
    } else {
      this.territorySelectedEL = {};
      alert('No area selected.');
    }
  }
  getAllTerritoryEC() {
    this.territoryCodeEC = "";
    this.apiUrl = "";

    if (this.areaSelectedEC && Object.keys(this.areaSelectedEC).length > 0) {
      const areaArray = Object.values(this.areaSelectedEC) as { id: string; name: string }[];

      const areaCodes = areaArray.map((zone) => zone.id).join(',');
      this.areaCodeEC = areaCodes;
      this.apiUrl = `CmnDropDown/GetTerritoryByAreaCodes?areaCodes=${this.areaCode}`;
      this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
        if (returns.success) {
          this.territoryListEC = returns.data.map((val: any) => ({
            id: val.code,
            name: val.name,
          }));
        }
      });
    } else {
      this.territorySelectedEC = {};
      alert('No area selected.');
    }
  }

  territoryChange() {
    if (this.territorySelected && Object.keys(this.territorySelected).length > 0) {
      const territoryArray = Object.values(this.territorySelected) as { id: string; name: string }[];

      const territoryCodes = territoryArray.map((zone) => zone.id).join(',');
      this.territoryCode = territoryCodes;
    }
  }
  territoryChangeEL() {
    if (this.territorySelectedEL && Object.keys(this.territorySelectedEL).length > 0) {
      const territoryArray = Object.values(this.territorySelectedEL) as { id: string; name: string }[];

      const territoryCodesEL = territoryArray.map((zone) => zone.id).join(',');
      this.territoryCodeEL = territoryCodesEL;
    }
  }
  territoryChangeEC() {
    if (this.territorySelectedEC && Object.keys(this.territorySelectedEC).length > 0) {
      const territoryArray = Object.values(this.territorySelectedEC) as { id: string; name: string }[];

      const territoryCodesEC = territoryArray.map((zone) => zone.id).join(',');
      this.territoryCodeEC = territoryCodesEC;
    }
  }

  expenseSummaryValue: number = 0;
  expeseFor: string = 'National';
  getNationalExpeseSumamry() {
    this.apiUrl = "";
    this.fDate = this.commonService.DateFormat(this.fDate);
    this.tDate = this.commonService.DateFormat(this.tDate);
    this.apiUrl = `ExpenseDashboard/GetNationalExpeseSumamry?locationType=${this.nationalExpenseLocationTypeSelected['id']}&zoneCodes=${this.zoneCode}&regionCodes=${this.regionCode}&areaCodes=${this.areaCode}&territoryCodes=${this.territoryCode}&fromDate=${this.fDate}&toDate=${this.tDate}`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {

        this.expenseSummaryValue = returns.data[0].value;
        this.expeseFor = returns.data[0].expenseFor;
      }
      else {
        this.expenseSummaryValue = 0;
        this.expeseFor = "";
      }
    })
  }
  // Depot Overview

  depotOverviewSummary: any = [];
  depotOverviewDetails: any = [];
  depotOverviewDetailsHeaders: any = [];

  depotOverviewDataset: any = [];
  depotOverviewLabels: any = [];
  getDepotOverview() {
    this.apiUrl = `ExpenseDashboard/getDepotWiseExpense?expenseYear=${this.depotOverviewYear}&isDetails=${this.isDetailsOfDepotOverview}`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {

        if (this.isDetailsOfDepotOverview) {
          this.depotOverviewDetails = returns.data;
          this.depotOverviewDetailsHeaders = Object.keys(this.depotOverviewDetails[0]);
        } else {
          this.depotOverviewDataset = null;
          this.depotOverviewLabels = null;
          this.depotOverviewSummary = returns.data;
          const expenseData = {};

          returns.data.forEach(item => {
            if (!expenseData[item.DepotName]) {
              expenseData[item.DepotName] = 0;
            }
            expenseData[item.DepotName] += item.amount;
          });

          const labels = Object.keys(expenseData);
          const data = Object.values(expenseData);
          const backgroundColors = labels.map(() => this.getRandomColor(0.2));
          const borderColors = labels.map(() => this.getRandomColor());

          const datasets = [{
            label: 'Depot Expenses',
            data: data,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
          }];
          this.depotOverviewDataset = datasets;
          this.depotOverviewLabels = labels;
          this.createOrUpdateDepotOverview(datasets, labels);
        }
      }
    });
  }

  // Category wise expense

  categoryOverviewSummary: any = [];
  categoryOverviewDetails: any = [];
  categoryOverviewDetailsHeaders: any = [];

  categoryOverviewDataset: any = [];
  categoryOverviewLabels: any = [];
  getcategoryOverview() {
    debugger;
    this.apiUrl = `ExpenseDashboard/getExpenseCategoryWiseOverview?locationType=${this.expenseCategoryTypeSelected['id']}&zoneCodes=${this.zoneCodeEC}&regionCodes=${this.regionCodeEC}&areaCodes=${this.areaCodeEC}&territoryCodes=${this.territoryCodeEC}&fromDate=${this.commonService.DateFormat(this.fDateEC)}&toDate=${this.commonService.DateFormat(this.tDateEC)}&isDetails=${this.isDetailsOfCategoryWiseExpense}`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {

        if (this.isDetailsOfCategoryWiseExpense) {
          this.categoryOverviewDetails = returns.data;
          this.categoryOverviewDetailsHeaders = Object.keys(this.categoryOverviewDetails[0]);
        } else {
          this.categoryOverviewDataset = null;
          this.categoryOverviewLabels = null;
          this.categoryOverviewSummary = returns.data;
          const expenseData = {};

          returns.data.forEach(item => {
            if (!expenseData[item.expenseCategoryName]) {
              expenseData[item.expenseCategoryName] = 0;
            }
            expenseData[item.expenseCategoryName] += item.value;
          });

          const labels = Object.keys(expenseData);
          const data = Object.values(expenseData);
          const backgroundColors = labels.map(() => this.getRandomColor(0.2));
          const borderColors = labels.map(() => this.getRandomColor());

          const datasets = [{
            label: 'Depot Expenses',
            data: data,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
          }];
          this.categoryOverviewDataset = datasets;
          this.categoryOverviewLabels = labels;
          this.createOrUpdateCategoryOverview(datasets, labels);
        }
      }
    });
  }

  salaries: number[] = [];
  foodAllownce: number[] = [];
  nationalExpenseComparisonFilterId: number = 2024;

  myChart: any;
  myChart3: any;
  depotOverviewChart: any;
  categoryOverviewChart: any;
  getNationalExpenseComparisonMonthly() {

    this.salaries = [];
    this.foodAllownce = [];
    this.apiUrl = `ExpenseDashboard/GetNationalExpenseComparisonByYears?expenseYearOne=${this.comparigonFirstYear}&expenseYearTwo=${this.comparigonSecondYear}`;

    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {

        const sortedData = returns.data.sort((a, b) => a.monthOrder - b.monthOrder);

        const expenseData = {};
        sortedData.forEach(item => {

          if (!expenseData[item.year]) {
            expenseData[item.year] = new Array(12).fill(0);
          }
          expenseData[item.year][item.monthOrder - 1] = item.amount;
        });

        const datasets = Object.keys(expenseData).map(year => ({
          label: year,
          data: expenseData[year],
          borderColor: this.getRandomColor(),
          backgroundColor: this.getRandomColor(0.2),
          fill: true
        }));

        this.createOrUpdateComparisonChart(datasets);
      } else {
        console.error('Failed to fetch data from the API.');
      }
    });
  }
  //cost head
  getNationalExpenseComparison() {
    debugger;
    this.salaries = [];
    this.foodAllownce = [];
    this.apiUrl = `ExpenseDashboard/GetNationalCostHeadWiseExpense?expenseYear=${this.costHeadYear}`;

    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {

        const sortedData = returns.data.sort((a, b) => a.monthOrder - b.monthOrder);

        const expenseData = {};
        sortedData.forEach(item => {

          if (!expenseData[item.expenseHeadName]) {
            expenseData[item.expenseHeadName] = new Array(12).fill(0);
          }
          expenseData[item.expenseHeadName][item.monthOrder - 1] = item.amount;
        });
        debugger;
        const datasets = Object.keys(expenseData).map(expenseHeadName => ({
          label: expenseHeadName,
          data: expenseData[expenseHeadName],
          borderColor: this.getRandomColor(),
          backgroundColor: this.getRandomColor(0.2),
          fill: true
        }));

        this.createOrUpdateChart(datasets);
      } else {
        console.error('Failed to fetch data from the API.');
      }
    });
  }

  getRandomColor(opacity = 0.5) {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  createOrUpdateChart(datasets) {
    const ctx = document.getElementById('myChart4') as HTMLCanvasElement;
    if (this.myChart) {
      this.myChart.destroy();
    }
    this.myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Monthly Expenses'
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: function (value) {
                return `$${value.toLocaleString()}`;
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          },
        },
        legend: {
          position: 'bottom'
        }
      }
    });
  }

  createOrUpdateComparisonChart(datasets) {

    const ctx = document.getElementById('myChart3') as HTMLCanvasElement;
    if (this.myChart3) {
      this.myChart3.destroy();
    }
    this.myChart3 = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Monthly Expenses'
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: function (value) {
                return `$${value.toLocaleString()}`;
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          },
        },
        legend: {
          position: 'bottom'
        }
      }
    });
  }

  createOrUpdateDepotOverview(datasets, labels) {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (this.depotOverviewChart) {
      this.depotOverviewChart.destroy();
    }
    this.depotOverviewChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Depot Wise Expenses'
          }
        },
        legend: {
          position: 'bottom'
        }
      }
    });
  }

  createOrUpdateCategoryOverview(datasets, labels) {
    debugger;
    const ctx = document.getElementById('myChart2') as HTMLCanvasElement;
    if (this.categoryOverviewChart) {
      this.categoryOverviewChart.destroy();
    }
    this.categoryOverviewChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Category Wise Expenses'
          }
        },
        legend: {
          position: 'bottom'
        }
      }
    });
  }


  onChangeNationalExpenseFilter(event: any) {
    this.nationalExpenseComparisonFilterId = event.id;
    this.getNationalExpenseComparison();
  }

  nationalExpenseComparisonFilterList = this.YearFilterList;
  expenseLocationsFilterList = this.YearFilterList;
  //   [
  //   { "id": "2025", "name": "This Year" },
  //   { "id": "2024", "name": "Last Year" }
  // ];
  costHeadFilterList = this.YearFilterList;
  depotOverviewFilterList = this.YearFilterList;
  expenseCategoryFilterList = this.YearFilterList;
  expenseLocationTypeList = [{ "id": "Z", "name": "Zone" },
  { "id": "R", "name": "Region" },
  { "id": "A", "name": "Area" },
  { "id": "T", "name": "Territory" },
  { "id": "F", "name": "Factory" },
  { "id": "H", "name": "Head Office" }]
  nationalExpenseLocationTypeList = this.expenseLocationTypeList;

  customYearFilterList = [{ "id": this.thisYear, "name": "This Year" }, { "id": this.lastYear, "name": "Last Year" }, { "id": 'Customed', "name": "Customed" }];



  initializeCharts() {
    this.getNationalExpenseComparison();
    //this.createOrUpdateCategoryOverview(this.categoryOverviewDataset, this.categoryOverviewLabels);
    this.getcategoryOverview();
    this.getDepotOverview();
    this.getcategoryOverview();
    this.isDeptotOverViewList = false;
  }

  toggleDepotOverview() {
    this.isDeptotOverViewList = !this.isDeptotOverViewList;
    if (!this.isDeptotOverViewList) {
      setTimeout(() => {
        //this.renderChartDepotOverView();
        this.createOrUpdateDepotOverview(this.depotOverviewDataset, this.depotOverviewLabels);
      }, 0);
    }
  }
  // renderChartDepotOverView() {
  //   const canvas = <HTMLCanvasElement>document.getElementById('myChart');
  //   const ctx = canvas.getContext('2d');

  //   if (ctx) {
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);

  //     new Chart(ctx, {
  //       type: 'pie',
  //       data: {
  //         labels: ['Rajshahi', 'Dhaka', 'Barisal', 'Khulna', 'Rongpur', 'B.Baria', 'Feni', 'Sylhet'],
  //         datasets: [{
  //           label: 'Total cases.',
  //           data: [886789, 213024, 189973, 158183, 153129, 138078, 101790, 87026],
  //           borderWidth: 1,
  //           backgroundColor: ['rgb(13,145,202)', 'rgb(255, 64, 105)', 'rgb(255,194,52)', 'rgb(31,12,100)', 'rgb(12, 180, 96)', 'rgb(5,155,255)', 'rgb(51,130,169)', 'rgb(31,12,100)']
  //         }]
  //       },
  //       options: {
  //         legend: {
  //           display: true,
  //           position: 'bottom'
  //         },
  //         responsive: true,
  //         display: true
  //       },
  //     });
  //   }
  // }
  toggleExpenseCategotyView() {
    this.isExpenseCategoryList = !this.isExpenseCategoryList;
    if (!this.isExpenseCategoryList) {
      setTimeout(() => {
        this.getcategoryOverview();
      }, 0);
    }
  }
  // renderChartExpenseCategoryView() {
  //   const canvas = <HTMLCanvasElement>document.getElementById('myChart2');
  //   const ctx = canvas.getContext('2d');

  //   if (ctx) {
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);

  //     new Chart(ctx, {
  //       type: 'pie',
  //       data: {
  //         labels: ['Marketing', 'Salary', 'LC', 'RM Purchase', 'Purchase', 'OT Allowance', 'Bonus', 'Others'],
  //         datasets: [{
  //           label: 'Total cases.',
  //           data: [886789, 213024, 189973, 158183, 153129, 138078, 101790, 87026],
  //           backgroundColor: ['rgb(130,15,20)', 'rgb(100,12,15)', 'rgb(234,103,108)', 'rgb(216,25,35)', 'rgb(216,25,33)', 'rgb(130,15,20)', 'rgb(51,130,169)', 'rgb(31,12,100)'],
  //           borderWidth: 1
  //         }]
  //       },
  //       options: {
  //         legend: {
  //           display: true,
  //           position: 'bottom'
  //         },
  //         responsive: true,
  //         display: true
  //       },
  //     });
  //   }
  // }

  dealyLoadCharts() {
    setTimeout(() => {
      //this.renderChartCostHeadView();
      this.getLocationWiseExpense();
      this.getNationalExpenseComparisonMonthly();
      this.getNationalExpenseComparison();
      this.getcategoryOverview();
    }, 0);
  }
  // renderChartCostHeadView() {
  //   const canvas = <HTMLCanvasElement>document.getElementById('myChart3');
  //   const ctx = canvas.getContext('2d');

  //   if (ctx) {
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);

  //     new Chart(ctx, {
  //       type: 'line',
  //       data: {
  //         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  //         datasets: [{
  //           label: 'Logistic',
  //           data: [886789, 213024, 129973, 158183, 153129, 138078, 101790, 87026, 82804, 62773, 50036, 10230],
  //           borderColor: 'rgb(161, 85, 185)',
  //           backgroundColor: 'transparent',
  //           borderWidth: 2,
  //           pointBackgroundColor: 'rgb(72, 137, 154)',
  //           //borderDash: [5, 5]
  //         },
  //         {
  //           label: 'Marketing',
  //           data: [560, 183024, 158987, 161883, 163129, 148078, 102790, 97026, 72804, 12773, 60036, 30230],
  //           borderColor: 'rgb(85, 185, 180)',
  //           backgroundColor: 'transparent',
  //           borderWidth: 2,
  //           pointBackgroundColor: 'rgb(94, 137, 254)',
  //           //borderDash: [5, 5]
  //         },
  //         {
  //           label: 'LC',
  //           data: [54560, 78960, 150987, 14526, 103129, 14807, 112790, 87026, 32804, 13773, 30036, 10230],
  //           borderColor: 'rgb(101, 103, 247)',
  //           backgroundColor: 'transparent',
  //           borderWidth: 2,
  //           pointBackgroundColor: 'rgb(94, 137, 254)',
  //           //borderDash: [5, 5]
  //         },
  //         {
  //           label: 'Raw Materials',
  //           data: [14560, 78060, 158187, 15526, 53129, 10807, 102790, 17026, 12451, 14785, 60036, 20230],
  //           borderColor: 'rgb(255, 165, 203)',
  //           backgroundColor: 'transparent',
  //           borderWidth: 2,
  //           pointBackgroundColor: 'rgb(94, 137, 254)',
  //           //borderDash: [5, 5]
  //         }
  //         ]
  //       },
  //       options: {
  //         responsive: true,
  //         interaction: {
  //           mode: 'index',
  //           intersect: false,
  //         },
  //         stacked: false,
  //         plugins: {
  //           title: {
  //             display: true,
  //             text: 'Chart.js Line Chart - Multi Axis'
  //           }
  //         },
  //         scales: {
  //           y: {
  //             type: 'linear',
  //             display: true,
  //             position: 'left',
  //           },
  //           y1: {
  //             type: 'linear',
  //             display: true,
  //             position: 'right',

  //             grid: {
  //               drawOnChartArea: false,
  //             },
  //           },
  //         },
  //         legend: {
  //           display: true,
  //           position: 'bottom',
  //         },
  //       },
  //     });
  //   }
  // }
  // locationWiseExpenseSummary: any[] = [];
  // locationWiseExpenseDetails: any[] = [];
  // getLocationWiseExpense() {
  //   
  //   this.locationWiseExpenseSummary = [];
  //   this.locationWiseExpenseDetails = [];
  //   this.apiUrl = "";
  //   this.fDate = this.commonService.DateFormat(this.fDate);
  //   this.tDate = this.commonService.DateFormat(this.tDate);
  //   this.apiUrl = `ExpenseDashboard/GetLocationWiseExpense?locationType=${this.expenseLocationTypeSelected['id']}&zoneCodes=${this.zoneCodeEL}&regionCodes=${this.regionCodeEL}&areaCodes=${this.areaCodeEL}&territoryCodes=${this.territoryCodeEL}&fromDate=${this.commonService.DateFormat(this.fDateEL)}&toDate=${this.commonService.DateFormat(this.tDateEL)}&isDetails=${this.isDetailsOfLocationWiseExpense}`;
  //   this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
  //     if (returns.success) {
  //       this.locationWiseExpenseSummary = returns.data;
  //       if (this.isDetailsOfLocationWiseExpense) {
  //         this.locationWiseExpenseDetails = returns.data;
  //       }
  //     }
  //   });
  // }
  locationWiseExpenseSummary: any[] = [];
  locationWiseExpenseDetails: any[] = [];
  tableHeadersLE: string[] = []; //location wise expense

  getLocationWiseExpense() {

    this.locationWiseExpenseSummary = [];
    this.locationWiseExpenseDetails = [];
    this.apiUrl = "";
    this.fDate = this.commonService.DateFormat(this.fDate);
    this.tDate = this.commonService.DateFormat(this.tDate);
    this.apiUrl = `ExpenseDashboard/GetLocationWiseExpense?locationType=${this.expenseLocationTypeSelected['id']}&zoneCodes=${this.zoneCodeEL}&regionCodes=${this.regionCodeEL}&areaCodes=${this.areaCodeEL}&territoryCodes=${this.territoryCodeEL}&fromDate=${this.commonService.DateFormat(this.fDateEL)}&toDate=${this.commonService.DateFormat(this.tDateEL)}&isDetails=${this.isDetailsOfLocationWiseExpense}`;
    this.commonService.getApiData(this.apiUrl).subscribe((returns: any) => {
      if (returns.success) {
        this.locationWiseExpenseSummary = returns.data;
        if (this.isDetailsOfLocationWiseExpense) {
          this.locationWiseExpenseDetails = returns.data;
          if (returns.data.length > 0) {
            this.tableHeadersLE = Object.keys(returns.data[0]);
          }
        }
      }
    });
  }


  setFilters(locationType: any) {

    if (locationType == 'Z') {
      this.isShowZone = true;
      this.isShowRegion = false;
      this.isShowArea = false;
      this.isShowTerritory = false;
      //this.expenseLocation = "Zone";
    }
    else if (locationType == 'R') {
      this.isShowZone = true;
      this.isShowRegion = true;
      this.isShowArea = false;
      this.isShowTerritory = false;
      //this.expenseLocation = "Region";
    }
    else if (locationType == 'A') {
      this.isShowZone = true;
      this.isShowRegion = true;
      this.isShowArea = true;
      this.isShowTerritory = false;
      //this.expenseLocation = "Area";
    }
    else if (locationType == 'T') {
      this.isShowZone = true;
      this.isShowRegion = true;
      this.isShowArea = true;
      this.isShowTerritory = true;
      //this.expenseLocation = "Territory";
    }
    else {
      this.isShowZone = false;
      this.isShowRegion = false;
      this.isShowArea = false;
      this.isShowTerritory = false;
      //locationType == "F" ? this.expenseLocation = "Factory" : this.expenseLocation = "Head Office";
    }
  }

  setFiltersEL(locationType: any) {

    if (locationType == 'Z') {
      this.isShowZoneEL = true;
      this.isShowRegionEL = false;
      this.isShowAreaEL = false;
      this.isShowTerritoryEL = false;
      this.expenseLocation = "Zone";
    }
    else if (locationType == 'R') {
      this.isShowZoneEL = true;
      this.isShowRegionEL = true;
      this.isShowAreaEL = false;
      this.isShowTerritoryEL = false;
      this.expenseLocation = "Region";
    }
    else if (locationType == 'A') {
      this.isShowZoneEL = true;
      this.isShowRegionEL = true;
      this.isShowAreaEL = true;
      this.isShowTerritoryEL = false;
      this.expenseLocation = "Area";
    }
    else if (locationType == 'T') {
      this.isShowZoneEL = true;
      this.isShowRegionEL = true;
      this.isShowAreaEL = true;
      this.isShowTerritoryEL = true;
      this.expenseLocation = "Territory";
    }
    else {
      this.isShowZoneEL = false;
      this.isShowRegionEL = false;
      this.isShowAreaEL = false;
      this.isShowTerritoryEL = false;
      locationType == "F" ? this.expenseLocation = "Factory" : this.expenseLocation = "Head Office";
    }
  }

  setFiltersEC(locationType: any) {

    if (locationType == 'Z') {
      this.isShowZoneEC = true;
      this.isShowRegionEC = false;
      this.isShowAreaEC = false;
      this.isShowTerritoryEC = false;
      this.zoneCodeEC = null;
      this.regionCodeEC = null;
      this.areaCodeEC = null;
      this.territoryCodeEC = null;
      this.zoneSelectedEC = {};
      this.regionSelectedEC = {};
      this.areaSelectedEC = {};
      this.territorySelectedEC = {};

      this.regionListEC = [];
      this.areaListEC = [];
      this.territoryListEC = [];


      //this.expenseLocation = "Zone";
    }
    else if (locationType == 'R') {
      this.isShowZoneEC = true;
      this.isShowRegionEC = true;
      this.isShowAreaEC = false;
      this.isShowTerritoryEC = false;
      //this.expenseLocation = "Region";
      this.zoneCodeEC = null;
      this.regionCodeEC = null;
      this.areaCodeEC = null;
      this.territoryCodeEC = null;

      this.regionSelectedEC = {};
      this.areaSelectedEC = {};
      this.territorySelectedEC = {};

      this.areaListEC = [];
      this.territoryListEC = [];
    }
    else if (locationType == 'A') {
      this.isShowZoneEC = true;
      this.isShowRegionEC = true;
      this.isShowAreaEC = true;
      this.isShowTerritoryEC = false;
      //this.expenseLocation = "Area";
      this.zoneCodeEC = null;
      this.regionCodeEC = null;
      this.areaCodeEC = null;
      this.territoryCodeEC = null;

      this.areaSelectedEC = {};
      this.territorySelectedEC = {};

      this.territoryListEC = [];
    }
    else if (locationType == 'T') {
      this.isShowZoneEC = true;
      this.isShowRegionEC = true;
      this.isShowAreaEC = true;
      this.isShowTerritoryEC = true;
      //this.expenseLocation = "Territory";
      this.zoneCodeEC = null;
      this.regionCodeEC = null;
      this.areaCodeEC = null;
      this.territoryCodeEC = null;

      this.territorySelectedEC = {};
    }
    else {
      this.isShowZoneEC = false;
      this.isShowRegionEC = false;
      this.isShowAreaEC = false;
      this.isShowTerritoryEC = false;
      //locationType == "F" ? this.expenseLocation = "Factory" : this.expenseLocation = "Head Office";
      this.zoneCodeEC = null;
      this.regionCodeEC = null;
      this.areaCodeEC = null;
      this.territoryCodeEC = null;
    }
  }
  isCustomYear: boolean = false;
  customYearRange: string = null;

  setCustomYearFilter(event: any) {

    this.customYearRange = null;
    if (event.id == 'Customed') {
      this.isCustomYear = true;
    }
    else {
      this.isCustomYear = false;
    }

  }
  comparigonFirstYear: number = new Date().getFullYear();
  comparigonSecondYear: number = this.comparigonFirstYear - 1;
  setComparisonYear() {

    if (this.customYearSelected['id'] == 'Customed') {
      if (!this.customYearRange.includes(',')) {
        try {
          const a = parseInt(this.customYearRange);
          if (a == undefined || a <= 0) {
            alert('Please select valid year range. i.e. 2021,2022 or 2021');
            return;
          }
          else {
            this.comparigonFirstYear = a;
            this.comparigonSecondYear = this.comparigonFirstYear - 1;
            //api call here
          }
        }
        catch (error) {
          alert('Please select valid year range. i.e. 2021,2022 or 2021');
          return;
        }
      }
      else {
        const [a, b] = this.customYearRange.split(',').map(x => parseInt(x));
        if (a == undefined || b == undefined || a <= 0 || b <= 0 || Number.isNaN(a) || Number.isNaN(b)) {
          alert('Please select valid year range');
          return;
        }
        this.comparigonFirstYear = a;
        this.comparigonSecondYear = b;
        //api call here
      }
    }
    else {
      this.customYearRange = null;
      this.comparigonFirstYear = this.customYearSelected['id'];
      this.comparigonSecondYear = this.comparigonFirstYear - 1;
      //api call here
    }
  }
  // for cost head
  setCustomYearFilterCostHead(event: any) {

    this.customYear = null;
    if (event.id == 'Customed') {
      this.isCostHeadCustomYear = true;
    }
    else {
      this.isCostHeadCustomYear = false;
    }
  }
  costHeadYear: number = new Date().getFullYear();
  setComparisonYearCostHead() {

    if (this.costHeadCustomYearSelected['id'] == 'Customed') {

      if (this.customYear == undefined || this.customYear <= 0) {
        alert('Please select valid year');
        return;
      }
      this.costHeadYear = this.customYear;
    }
    else {
      this.customYear = null;
      this.costHeadYear = this.costHeadCustomYearSelected['id'];
    }
  }
  setCustomYearFilterDepotOverview(event: any) {

    this.customYearDepotOverview = null;
    if (event.id == 'Customed') {
      this.isCustomYearDepotOverview = true;
    }
    else {
      this.isCustomYearDepotOverview = false;
    }

  }
  depotOverviewYear: number = new Date().getFullYear();
  setComparisonYearCostHeadDepotVoerview() {

    if (this.customYearSelectedDepotOverview['id'] == 'Customed') {

      if (this.customYearDepotOverview == undefined || this.customYearDepotOverview <= 0) {
        alert('Please select valid year');
        return;
      }
      this.depotOverviewYear = this.customYearDepotOverview;
    }
    else {
      this.depotOverviewYear = null;
      this.depotOverviewYear = this.customYearSelectedDepotOverview['id'];
    }
  }

  setCustomYearFilterExpenseCategory(event: any) {

    this.customYearExpenseCategory = null;
    if (event.id == 'Customed') {
      this.isCustomYearExpenseCategory = true;
    }
    else {
      this.isCustomYearExpenseCategory = false;
    }

  }
  expenseCategoryYear: number = new Date().getFullYear();
  setComparisonYearExpenseCategory() {

    if (this.customYearSelectedExpenseCategory['id'] == 'Customed') {

      if (this.customYearExpenseCategory == undefined || this.customYearExpenseCategory <= 0) {
        alert('Please select valid year');
        return;
      }
      this.expenseCategoryYear = this.customYearExpenseCategory;
    }
    else {
      this.expenseCategoryYear = null;
      this.expenseCategoryYear = this.customYearSelectedExpenseCategory['id'];
    }
  }
  getToMainDashboard() {
    setTimeout(() => {
      debugger;
      this.isDetails = false;
      this.isDetailsOfCategoryWiseExpense = false;
      this.isDetailsOfDepotOverview = false;
      this.isDeptotOverViewList = false;
      this.isDetailsOfLocationWiseExpense = false;
      this.ngOnInit();
      this.dealyLoadCharts();
      this.initializeCharts();
      //this.getLocationWiseExpense();
    }, 10);

  }

}
