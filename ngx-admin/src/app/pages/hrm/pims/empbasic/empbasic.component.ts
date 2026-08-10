import { Component, OnInit } from "@angular/core";
import { NbToastrService } from "@nebular/theme";
import { CommoncomboService } from "app/services/commoncombo.service";
import { CommonService } from "../../../../@core/mock/common.service";
import { ActivatedRoute } from '@angular/router';
import { EmployeeinformationService } from "app/services/hrm/employeeinformation.service";
import { HrmmasterService } from "app/services/hrm/hrmmaster.service";
import { FieldforcemasterService } from "app/services/fieldforcetracking/fieldforcemaster.service";
import { SalarygradeService } from "app/services/salary/salarymaster/salarygrade.service";
import { SalaryslabService } from "app/services/salary/salarymaster/salaryslab.service";


@Component({
  selector: 'ngx-empbasic',
  templateUrl: './empbasic.component.html',
  styleUrls: ['./empbasic.component.scss']
})
export class EmpbasicComponent implements OnInit {


  showMIO: boolean = false;
  showZone: boolean = false;
  showDepo: boolean = false;
  showRegion: boolean = false;
  showArea: boolean = false;
  showTerritory: boolean = false;

  master: {
    employeeId: number;
    employeeNo: string;
    employeeTypeId: number;

    firstName: string;
    middleName: string;
    lastName: string;
    fullName: string;
    emailId: string;
    skypeId: string;
    facebookId: string;
    whatsApp: string;
    viber: string;
    linkedIN: string;
    fathersName: string;
    mothersName: string;
    employeeStatusId: number;
    bloodGroupId: number;
    religionId: number;
    mobileNo: string;
    phoneNo: string;
    uniqueIdentityId: number;
    height: number;
    DOB: Date;
    passportNO: string;
    NID: string;
    binNo: string;
    officeId: string;
    genderId: number;
    effectiveDate: Date;
    companyId: number;
    companyBankId: number;
    probationPeriodId: number;
    joiningDate: Date;
    maritalStatus: string;
    drivingLicense: string;
    tinNo: string;
    sbuId: number;
    currentDesignation: string;
    currentDepartment: string;
    nationality: string;
    isSalaryActive: boolean;
    haveVehicle: boolean;
    actionCheckbox: boolean;
    confirmationDate: Date;
    salaryGradeId: number;
    salarySlabId: number;


    EmployeeTypeSelected: {};
    EmployeeReligionSelected: {};
    EmployeeUniqueIdentitySelected: {};
    EmployeeGenderSelected: {};
    EmployeeBloodGroupSelected: {};
    EmployeeStatusSelected: {};
    EmployeeCompanySelected: {};
    MartialStatusSelected: {};
    SbuSelected: {};
    DesignationSelected: {};
    DepartmentSelected: {};
    NationalitySelected: {};
    salaryDepotId: string;
    SalaryDepotSelected: {};
    salaryGradeSelected: {};
    salarySlabSelected: {};
    zoneId: string;
    depoId: string;
    regionId: string;
    areaId: string;
    territoryId: string;
    postingLocation: string;
    zoneSelected: {};
    depotSelected: {};
    regionSelected: {};
    areaSelected: {};
    territorySelected: {};
    postingLocationSelected: {};
    CompanyBankSelected: {};
    ProbationPeriodSelected: {};
    isTopManagement: number;
    salaryLocation: string;
    salaryLocationSelected: {};
    isTopManagementSelected: {};

    countData: number;
    heldUpDate: Date;
    separationTypeId: number;
    separationEffectiveDate: Date
    separationTypeSelected: {};
    deviceNo: string;

  };

  employeeId = 0;
  employeeName = '';
  public pageNavigation = "";
  datePipe: any;

  public getMaster() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.employeeId = params['employeeId'];
      this.employeeinformationService.GetEmployeeBasicInfoById(this.employeeId).subscribe((data: any) => {
        if (data.success) {
          this.master = data.data[0];
          //console.log(data.data[0]);
          //console.log(this.master);


          this.employeeName = data.data[0].fullName;
          this.pageNavigation = this.employeeName + "'s Basic Information";

          this.master.EmployeeTypeSelected = {
            id: data.data[0].employeeTypeId,
            name: data.data[0].empType,
          };
          this.master.EmployeeStatusSelected = {
            id: data.data[0].employeeStatusId,
            name: data.data[0].statusName,
          };
          this.master.SalaryDepotSelected = {
            id: data.data[0].salaryDepotId,
            name: data.data[0].salaryDepotName
          };
          this.master.CompanyBankSelected = {
            id: data.data[0].companyBankId,
            name: data.data[0].bankName
          };
          this.master.EmployeeBloodGroupSelected = {
            id: data.data[0].bloodGroupId,
            name: data.data[0].bloodGroupName,
          };
          this.master.EmployeeReligionSelected = {
            id: data.data[0].religionId,
            name: data.data[0].religionName,
          };
          this.master.EmployeeUniqueIdentitySelected = {
            id: data.data[0].uniqueIdentityId,
            name: data.data[0].uniqueIdentityName,
          };
          this.master.EmployeeGenderSelected = {
            id: data.data[0].genderId,
            name: data.data[0].genderName,
          };
          this.master.EmployeeGenderSelected = {
            id: data.data[0].genderId,
            name: data.data[0].genderName,
          };
          this.master.EmployeeCompanySelected = {
            id: data.data[0].compnayId,
            name: data.data[0].companyName,
          };
          this.master.MartialStatusSelected = {
            id: data.data[0].maritalStatus,
            name: data.data[0].maritalStatus,
          };
          this.master.DesignationSelected = {
            id: data.data[0].currentDesignation,
            name: data.data[0].currentDesignation,
          };
          this.master.DepartmentSelected = {
            id: data.data[0].currentDepartment,
            name: data.data[0].currentDepartment,
          };
          this.getSBU(data.data[0].compnayId);
          this.master.SbuSelected = {
            id: data.data[0].sbuId,
            name: data.data[0].sbuName,
          };
          this.master.NationalitySelected = {
            id: data.data[0].nationality,
            name: data.data[0].nationality,
          };

          this.master.isTopManagementSelected = {
            id: data.data[0].isTopManagement,
            name: data.data[0].isTopManagementText,
          };

          this.master.salaryLocationSelected = {
            id: data.data[0].salaryLocation,
            name: data.data[0].salaryLocation,
          };

          this.master.ProbationPeriodSelected = {
            id: data.data[0].probationPeriodId,
            name: data.data[0].probationPeriodName,
          };
          this.master.separationTypeSelected = {
            id: data.data[0].separationTypeId,
            name: data.data[0].separationTypeName,
          }

          if (this.master.postingLocation !== '') {
            this.showMIO = true;
            this.master.actionCheckbox = true;
          } else {
            this.showMIO = false;
            this.master.actionCheckbox = false;
          }

          this.master.postingLocationSelected = {
            id: data.data[0].postingLocation,
            name: data.data[0].postingLocationName
          }
          this.master.salaryGradeSelected = {
            id: data.data[0].salaryGradeId,
            name: data.data[0].gradeName
          }
          this.master.salarySlabSelected = {
            id: data.data[0].salarySlabId,
            name: data.data[0].slabName
          }
          this.GetDesignationOnEdit();
          this.LoadSalarySlabEdit();

          this.showHideDdl();

          this.master.zoneSelected = {
            id: data.data[0].zoneId,
            name: data.data[0].ZoneName
          }


          this.GetAllDepo();

          //this.getregionbydepoCode(data.data[0].depoId);
          this.zoneChange(data.data[0].zoneId);
          //this.master.depoId = data.data[0].depoId;

          this.master.regionSelected = {
            id: data.data[0].regionId,
            name: data.data[0].RegionName
          }



          //this.getdepotbyCode(data.data[0].zoneId);
          this.regionChange(data.data[0].regionId);
          //this.master.zoneId = data.data[0].zoneId;
          this.master.areaSelected = {
            id: data.data[0].areaId,
            name: data.data[0].AreaName
          }

          this.master.depotSelected = {
            id: data.data[0].depoId,
            name: data.data[0].DepotName
          }

          //this.getareabyregionCode(data.data[0].regionId);
          ////this.master.regionId = data.data[0].regionId;

          this.getterritorybyareaCode(data.data[0].areaId);
          //this.master.areaId = data.data[0].areaId;

          this.master.territorySelected = {
            id: data.data[0].territoryId,
            name: data.data[0].TerritoryName
          }

          this.getDuplicate();

          if (this.master.joiningDate != null || this.master.joiningDate != undefined)
            this.master.joiningDate = new Date(this.master.joiningDate);
          if (this.master.DOB != null || this.master.DOB != undefined)
            this.master.DOB = new Date(this.master.DOB);

          if (this.master.effectiveDate != null || this.master.effectiveDate != undefined)
            this.master.effectiveDate = new Date(this.master.effectiveDate);

          if (this.master.heldUpDate != null || this.master.heldUpDate != undefined)
            this.master.heldUpDate = new Date(this.master.heldUpDate);

          if (this.master.separationEffectiveDate != null || this.master.separationEffectiveDate != undefined)
            this.master.separationEffectiveDate = new Date(this.master.separationEffectiveDate);
        }
      });
    });

    this.master = {
      employeeId: 0,
      employeeNo: '',
      employeeTypeId: null,
      firstName: '',
      middleName: '',
      lastName: '',
      fullName: '',
      emailId: '',
      skypeId: '',
      facebookId: '',
      whatsApp: '',
      viber: '',
      linkedIN: '',
      fathersName: '',
      mothersName: '',
      employeeStatusId: null,
      bloodGroupId: null,
      religionId: null,
      mobileNo: '',
      phoneNo: '',
      uniqueIdentityId: null,
      height: null,
      DOB: null,
      confirmationDate: null,
      passportNO: '',
      NID: '',
      binNo: '',
      officeId: '',
      genderId: null,
      effectiveDate: null,
      companyId: 0,
      companyBankId: null,
      salaryDepotId: '',
      SalaryDepotSelected: null,
      probationPeriodId: null,
      joiningDate: null,
      maritalStatus: '',
      drivingLicense: '',
      tinNo: '',
      sbuId: null,
      currentDesignation: '',
      currentDepartment: '',
      nationality: '',
      isSalaryActive: true,
      haveVehicle: false,
      actionCheckbox: false,
      salaryGradeId: null,
      salarySlabId: null,

      EmployeeTypeSelected: null,
      EmployeeReligionSelected: null,
      EmployeeUniqueIdentitySelected: null,
      EmployeeGenderSelected: null,
      EmployeeBloodGroupSelected: null,
      EmployeeStatusSelected: null,
      EmployeeCompanySelected: null,
      MartialStatusSelected: null,
      SbuSelected: null,
      DesignationSelected: null,
      DepartmentSelected: null,
      NationalitySelected: null,
      CompanyBankSelected: null,
      ProbationPeriodSelected: null,
      salaryGradeSelected: null,
      salarySlabSelected: null,
      zoneId: '',
      depoId: '',
      regionId: '',
      areaId: '',
      territoryId: '',
      postingLocation: '',
      zoneSelected: null,
      depotSelected: null,
      regionSelected: null,
      areaSelected: null,
      territorySelected: null,
      postingLocationSelected: null,

      isTopManagement: 0,
      salaryLocation: '',
      salaryLocationSelected: null,
      isTopManagementSelected: null,

      countData: 0,
      heldUpDate: new Date(),
      separationTypeId: null,
      separationEffectiveDate: new Date(),
      separationTypeSelected: null,
      deviceNo: ''
    };
  }



  constructor(
    private toastrService: NbToastrService,
    private commonService: CommonService,
    private comboService: CommoncomboService,
    private employeeinformationService: EmployeeinformationService,
    private activatedRoute: ActivatedRoute,
    private hrmmasterService: HrmmasterService,
    private fieldforcemasterService: FieldforcemasterService,
    private salarygradeService: SalarygradeService,
    private salaryslabService: SalaryslabService

  ) {

    this.getMaster();
    this.getEmployeeType();
    this.getReligion();
    this.getSalaryDepot();
    this.getCompanyBank();
    this.GetCompany();
    this.GetBloodGroup();
    this.GetGender();
    this.GetUniqueIdentity();
    this.GetEmployeeStatus();
    this.GetMaritalStatus();
    this.GetNationality();
    //this.GetDesignation();
    this.GetDepartment();
    this.getzone();
    this.GetAllDepo();
    this.GetpostingLocation();
    this.TopMStatusList();
    this.GetSalaryLocationJson();
    this.GetProbationPeriod();
    this.GetSeparationType();
    this.LoadSalaryGrade();
  }

  ngOnInit(): void {

  }

  public RptButtonAction() {
    const clicked = this.commonService.buttonClicked;
    if (clicked == "preview") {
      this.onPreview();
    } else if (clicked == "pdf") {
      this.generateReport("pdf");
    } else if (clicked == "save") {
      this.onEmail();
    } else {
      this.toastrService.warning("Message", "please clicked any button");
    }
  }

  public onCheckboxChange(e) {
    if (e.target.checked) {
      this.showMIO = true;
    } else {
      this.showMIO = false;
    }
  }

  public showHideDdl() {
    //this.ddlReportNameSelected = null;
    if (this.master.postingLocationSelected['id'] == "T") {
      this.showZone = true;
      this.showDepo = true;
      this.showRegion = true;
      this.showArea = true;
      this.showTerritory = true;
    } else if (this.master.postingLocationSelected['id'] == "A") {
      this.showZone = true;
      this.showDepo = true;
      this.showRegion = true;
      this.showArea = true;
      this.showTerritory = false;
      this.master.territorySelected = null;
      this.master.territoryId = null;
    } else if (this.master.postingLocationSelected['id'] == "R") {
      this.showZone = true;
      this.showDepo = true;
      this.showRegion = true;
      this.showArea = false;
      this.showTerritory = false;
      this.master.areaSelected = null;
      this.master.areaId = null;
      this.master.territorySelected = null;
      this.master.territoryId = null;
    } else if (this.master.postingLocationSelected['id'] == "D") {
      this.showZone = true;
      this.showDepo = true;
      this.showRegion = false;
      this.showArea = false;
      this.showTerritory = false;
      this.master.regionSelected = null;
      this.master.regionId = null;
      this.master.areaSelected = null;
      this.master.areaId = null;
      this.master.territorySelected = null;
      this.master.territoryId = null;
    } else if (this.master.postingLocationSelected['id'] == "Z") {
      this.showZone = true;
      this.showDepo = false;
      this.showRegion = false;
      this.showArea = false;
      this.showTerritory = false;
      this.master.depotSelected = null;
      this.master.depoId = null;
      this.master.regionSelected = null;
      this.master.regionId = null;
      this.master.areaSelected = null;
      this.master.areaId = null;
      this.master.territorySelected = null;
      this.master.territoryId = null;
    } else {
      this.showZone = false;
      this.showDepo = false;
      this.showRegion = false;
      this.showArea = false;
      this.showTerritory = false;
      this.master.zoneSelected = null;
      this.master.zoneId = null;
      this.master.depotSelected = null;
      this.master.depoId = null;
      this.master.regionSelected = null;
      this.master.regionId = null;
      this.master.areaSelected = null;
      this.master.areaId = null;
      this.master.territorySelected = null;
      this.master.territoryId = null;
    }
  }

  public getDuplicate() {
    this.employeeinformationService.GetDuplicateEmployeeNo(this.master.employeeId, this.master.employeeNo)
      .subscribe((returns: any) => {
        this.master.countData = returns.data[0].countData;
      });
  }

  public getDuplicateTerritoty(PostingLocation, Code) {
    if (PostingLocation == this.master.postingLocation) {
      this.employeeinformationService.getDuplicateTerritoty(this.master.employeeId, PostingLocation, Code)
        .subscribe((returns: any) => {
          if (returns.data[0].countData > 0) {
            this.toastrService.warning('Already A Officer in This Location', 'Warning');
            if (PostingLocation == 'T') {
              this.master.territoryId = '';
              this.master.territorySelected = [];
            } else if (PostingLocation == 'A') {
              this.master.areaId = '';
              this.master.areaSelected = [];
            } else {
              this.master.regionId = '';
              this.master.regionSelected = [];
            }
            return;
          }
        });
    }
  }

  public UpdateBasicInfo() {
    const popularDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "aol.com", "onepharmaltd.com"];
    const emailRegex = new RegExp(`^[\\w.-]+@(${popularDomains.join('|').replace(/\./g, '\\.')})$`);
    this.getDuplicate();
    if (this.master.employeeNo == "" || this.master.fullName == ""
      || this.master.genderId == undefined || this.master.companyId == undefined || this.master.employeeStatusId == undefined) {
      this.toastrService.danger("Please fill up required field", "Message");
      return false;
    }
    else if (this.master.countData != 0) {
      this.toastrService.danger("Duplicate employee no.", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (!this.master.isSalaryActive && this.master.heldUpDate === null) {
      this.toastrService.danger("Enter Salary Held Up Date.", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.joiningDate == null) {
      this.toastrService.danger("Please entry joining Date", "Message");
      this.commonService.valueSet("create");
      return false;
    } else if (this.master.currentDesignation == null || this.master.currentDesignation == '') {
      this.toastrService.danger("Please select Designation", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.currentDepartment == null || this.master.currentDepartment == '') {
      this.toastrService.danger("Please select Department", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else if (this.master.salaryDepotId == null || this.master.salaryDepotId == "") {
      this.toastrService.danger("Please select Salary Depot", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.NID && this.master.NID !== "" && this.master.NID.length !== 10 && this.master.NID.length !== 13 && this.master.NID.length !== 17) {
      this.toastrService.danger("NID must be 10, 13 or 17 digits", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    // if (this.master.binNo && this.master.binNo !== "" && this.master.binNo.length !== 17) {
    //   this.toastrService.danger("Birth Certificate Number must be 17 digits", "Message");
    //   this.commonService.valueSet("create");
    //   return false;
    // }
    if (this.master.tinNo && this.master.tinNo !== "" && this.master.tinNo.length !== 12) {
      this.toastrService.danger("eTin Number must be 12 digits", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.emailId && this.master.emailId !== "" && !emailRegex.test(this.master.emailId)) {
      this.toastrService.danger("Email must be a valid address with a popular domain (e.g., @gmail.com, @yahoo.com, @outlook.com, @hotmail.com, @aol.com)", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.skypeId && this.master.skypeId !== "" && !emailRegex.test(this.master.skypeId)) {
      this.toastrService.danger("Email must be a valid address with a popular domain (e.g., @gmail.com, @yahoo.com, @outlook.com, @hotmail.com, @aol.com)", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.salaryGradeId == null || this.master.salaryGradeId == 0) {
      this.toastrService.danger("Pleae select a employment type", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.salarySlabId == null || this.master.salarySlabId == 0) {
      this.toastrService.danger("Pleae select a salary grade", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    if (this.master.currentDesignation == null || this.master.currentDesignation == "") {
      this.toastrService.danger("Pleae select a designation", "Message");
      this.commonService.valueSet("create");
      return false;
    }
    else {
      debugger;

      if (this.master.joiningDate != null || this.master.joiningDate != undefined)
        this.master.joiningDate = this.commonService.DateFormat(this.master.joiningDate);

      if (this.master.DOB != null || this.master.DOB != undefined)
        this.master.DOB = this.commonService.DateFormat(this.master.DOB);

      if (this.master.effectiveDate != null || this.master.effectiveDate != undefined)
        this.master.effectiveDate = this.commonService.DateFormat(this.master.effectiveDate);

      if (this.master.heldUpDate != null || this.master.heldUpDate != undefined)
        this.master.heldUpDate = this.commonService.DateFormat(this.master.heldUpDate);

      if (this.master.separationEffectiveDate != null || this.master.separationEffectiveDate != undefined)
        this.master.separationEffectiveDate = this.commonService.DateFormat(this.master.separationEffectiveDate);

      if (this.master.separationTypeSelected == null || this.master.separationTypeSelected == undefined) {
        this.master.separationTypeId = null;
        this.master.separationEffectiveDate = null;
      }


      this.employeeinformationService.SaveEmployeeBasicInfo(this.master).subscribe((returns: any) => {
        if (returns.success) {
          this.toastrService.success(this.commonService.updatedmsg, "Message");
        }
      });
    }
  }

  public EmployeeTypeList = [];
  public getEmployeeType() {
    this.employeeinformationService.GetEmployeeType(0).subscribe((retuns: any) => {
      if (retuns.success) {
        this.EmployeeTypeList = retuns.data.map((val: any) => ({
          id: val.employeeTypeId,
          name: val.empType,
        }))
      }
    })
  }

  public ReligionList = [];
  public getReligion() {
    this.employeeinformationService.GetReligion(0).subscribe((retuns: any) => {
      if (retuns.success) {
        this.ReligionList = retuns.data.map((val: any) => ({
          id: val.religionId,
          name: val.name,
        }))
      }
    })
  }


  onProbationPeriodChange(event: any) {
    debugger;
    if (this.master.joiningDate) {
      let probationMonths = 0;
      if (event.id === 1) {
        probationMonths = 3;
      } else if (event.id === 2) {
        probationMonths = 6;
      } else if (event.id === 3) {
        // Not applicable
        this.master.confirmationDate = null;
        return;
      }

      // Calculate confirmation due date
      this.calculateConfirmationDueDate(probationMonths);
    }
  }

  onJoiningDateChange(event: any) {
    if (this.master.ProbationPeriodSelected) {
      debugger;
      let probationMonths = 0;
      if (this.master.probationPeriodId === 1) {
        probationMonths = 3;
      } else if (this.master.probationPeriodId === 2) {
        probationMonths = 6;
      }

      if (probationMonths > 0) {
        this.calculateConfirmationDueDate(probationMonths);
      }
    }
  }

  calculateConfirmationDueDate(months: number) {

    const joiningDate = new Date(this.master.joiningDate);
    joiningDate.setMonth(joiningDate.getMonth() + months);
    this.master.confirmationDate = joiningDate;
  }

  public bankList = [];
  public getCompanyBank() {
    this.employeeinformationService.GetCompanyBank(0).subscribe((retuns: any) => {
      if (retuns.success) {
        debugger;
        this.bankList = retuns.data.map((val: any) => ({
          id: val.companyBankId,
          name: val.bankName,
        }))
      }
    })
  }

  public CompanyList = [];
  public GetCompany() {
    this.comboService.getCompany().subscribe((retuns: any) => {
      if (retuns.success) {
        this.CompanyList = retuns.data.map((val: any) => ({
          id: val.companyId,
          name: val.companyName,
        }))
      }
    })
  }

  public ProbetionaryList = [];
  public GetProbationPeriod() {
    this.comboService.getProbationPeriod().subscribe((retuns: any) => {
      if (retuns.success) {
        debugger;
        this.ProbetionaryList = retuns.data.map((val: any) => ({
          id: val.probationPeriodId,
          name: val.probationPeriodName,
        }))
      }
    })
  }

  public SeparationTypeList = [];
  public GetSeparationType() {
    this.comboService.getSeparationType().subscribe((retuns: any) => {
      if (retuns.success) {
        debugger;
        this.SeparationTypeList = retuns.data.map((val: any) => ({
          id: val.separationTypeId,
          name: val.separationTypeName,
        }))
      }
    })
  }

  public BloodGroupList = [];
  public GetBloodGroup() {
    this.employeeinformationService.getBloodGroup(0).subscribe((retuns: any) => {
      if (retuns.success) {
        this.BloodGroupList = retuns.data.map((val: any) => ({
          id: val.bloodGroupId,
          name: val.Name,
        }))
      }
    })
  }

  public GenderList = [];
  public GetGender() {
    this.employeeinformationService.getGender(0).subscribe((retuns: any) => {
      if (retuns.success) {
        this.GenderList = retuns.data.map((val: any) => ({
          id: val.genderId,
          name: val.Name,
        }))
      }
    })
  }
  public salaryDepotList = [];
  public getSalaryDepot() {
    this.employeeinformationService.GetSalaryDepot(0).subscribe((retuns: any) => {
      if (retuns.success) {
        debugger;
        this.salaryDepotList = retuns.data.map((val: any) => ({
          id: val.salaryDepotId,
          name: val.salaryDepotName,
        }))
      }
    })
  }
  public UniqueIdentityList = [];
  public GetUniqueIdentity() {
    this.employeeinformationService.getUniqueIdentity(0).subscribe((retuns: any) => {
      if (retuns.success) {
        this.UniqueIdentityList = retuns.data.map((val: any) => ({
          id: val.uniqueIdentityId,
          name: val.Name,
        }))
      }
    })
  }

  public EmployeeStatusList = [];
  public GetEmployeeStatus() {
    this.employeeinformationService.getEmployeeStatus(0).subscribe((retuns: any) => {
      if (retuns.success) {
        this.EmployeeStatusList = retuns.data.map((val: any) => ({
          id: val.employeeStatusId,
          name: val.statusName,
        }))
      }
    })
  }

  public MaritalStatusList = [];
  public GetMaritalStatus() {
    this.comboService.getCmnDropDown(0, "Marital Status").subscribe((returns: any) => {
      this.MaritalStatusList = returns.data.map((val: any) => ({
        id: val.dropDownValue,
        name: val.dropDownText,
      }))
    })
  }

  public NationalityList = [];
  public GetNationality() {
    this.comboService.getCmnDropDown(0, "Nationality").subscribe((returns: any) => {
      this.NationalityList = returns.data.map((val: any) => ({
        id: val.dropDownValue,
        name: val.dropDownText,
      }))
    })
  }

  public SbuList = [];
  public getSBU(companyId) {
    this.master.SbuSelected = null;
    this.comboService.getSBUALL(companyId).subscribe((returns: any) => {
      this.SbuList = returns.data.map((val) => ({
        id: val.sbuId,
        name: val.sbuName,
      }));
    });
  }

  public SalaryLocationList = [];
  public GetSalaryLocationJson() {
    this.master.salaryLocationSelected = null;
    this.comboService.GetSalaryLocationJson().subscribe((returns: any) => {
      this.SalaryLocationList = returns.data.map((val) => ({
        id: val.Name,
        name: val.Name,
      }));
    });
  }

  TopMList: {};
  TopMStatusList() {
    this.master.isTopManagementSelected = null;
    this.TopMList = [
      {
        id: 1,
        name: "Top Management",
      },
      {
        id: 0,
        name: "General",
      }
    ];
  }

  // public DesignationList = [];
  // public GetDesignation() {
  //   this.hrmmasterService.getDesignation(0).subscribe((returns: any) => {
  //     this.DesignationList = returns.data.map((val: any) => ({
  //       id: val.designationName,
  //       name: val.designationName,
  //     }))
  //   })
  // }

  // public DepartmentList = [];
  // public GetDepartment() {
  //   this.hrmmasterService.getDepartment(0).subscribe((returns: any) => {
  //     this.DepartmentList = returns.data.map((val: any) => ({
  //       id: val.deptName,
  //       name: val.deptName,
  //     }))
  //   })
  // }

  public zoneList = [];
  public getzone() {
    this.fieldforcemasterService.getZone(0).subscribe((retuns: any) => {
      if (retuns.length) {
        this.zoneList = retuns.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }
  public depotList = [];
  public getdepot() {
    var zoneId = 0;
    this.fieldforcemasterService.getZone(0).subscribe((retuns: any) => {
      if (retuns.length) {
        zoneId = retuns[0].ZoneID
      }
    })
    this.fieldforcemasterService.getDepo(zoneId).subscribe((retuns: any) => {
      if (retuns.success) {
        this.depotList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }
  public getdepotbyCode(code) {
    this.master.depotSelected = {};
    this.fieldforcemasterService.getDepoByZoneCode(code).subscribe((retuns: any) => {
      if (retuns.success) {
        this.depotList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }
  public AreaList = [];
  public getareabyregionCode(ZoneCode) {
    this.master.areaSelected = {};
    this.fieldforcemasterService.getAreabyregioncode(ZoneCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.AreaList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }
  public RegionList = [];
  public getregionbydepoCode(ZoneCode) {
    this.master.regionSelected = {};
    this.fieldforcemasterService.getRegionbydepocode(ZoneCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.RegionList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }


  public zoneChange(ZoneCode) {
    this.master.regionSelected = {};
    this.fieldforcemasterService.GetRegionByZoneCode(ZoneCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.RegionList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }
  public GetAllDepo() {
    this.master.depotSelected = {};
    this.fieldforcemasterService.GetAllDepo('').subscribe((retuns: any) => {
      if (retuns.success) {
        debugger;
        this.depotList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }

  public regionChange_BAK(RegionCode) {
    this.master.depotSelected = {};
    this.fieldforcemasterService.GetDepoByRegionCode(RegionCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.depotList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }

  public regionChange(RegionCode) {
    debugger;
    this.master.areaSelected = {};
    this.fieldforcemasterService.GetAreaByRegionCode(RegionCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.AreaList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }

  public depoChange(DepoCode) {
    this.master.areaSelected = {};
    this.fieldforcemasterService.GetAreaByDepoCode(DepoCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.AreaList = retuns.data.map((val: any) => ({
          id: val.Code,
          name: val.Name,
        }))
      }
    })
  }


  public TerritoryList = [];
  public getterritorybyareaCode(ZoneCode) {
    this.master.territorySelected = null;
    this.fieldforcemasterService.getTerritorybyAreacode(ZoneCode).subscribe((retuns: any) => {
      if (retuns.success) {
        this.TerritoryList = retuns.data.map((val: any) => ({
          id: val.TerritoryCode,
          name: val.TerritoryName,
        }))
      }
    })
  }

  public PostingLocationList = [];
  public GetpostingLocation() {
    this.comboService.getCmnDropDown(0, "PostingLocation").subscribe((returns: any) => {
      this.PostingLocationList = returns.data.map((val: any) => ({
        id: val.dropDownValue,
        name: val.dropDownText,
      }))
    })
  }

  private onRefresh() {
    this.toastrService.warning("Message", "refresh button clicked");
  }

  private onPreview() {
    this.toastrService.warning("Message", "preview button clicked");
  }

  public generateReport(buttonAction: any) {

  }

  private onExportCSV() {

  }

  private onEmail() {
    this.toastrService.warning("Message", "email button clicked");
  }
  public DepartmentList = [];
  public GetDepartment() {
    this.hrmmasterService.getDepartment(0).subscribe((returns: any) => {
      this.DepartmentList = returns.data.map((val: any) => ({
        id: val.deptName,
        name: val.deptName,
      }))
    })
  }
  salaryGradeItems: [];
  public LoadSalaryGrade() {
    this.salaryGradeItems = null;
    this.salarySlabItems = null;
    this.DesignationList = null;
    this.salarygradeService.GetSalaryGradeById(0).subscribe((returns: any) => {
      this.salaryGradeItems = returns.data.map((val) => ({
        id: val.salaryGradeId,
        name: val.gradeName,
      }));
    });
  }
  public DesignationList = [];
  public GetDesignation() {
    this.DesignationList = [];
    this.master.DesignationSelected = null;
    this.master.currentDesignation = null;
    let slabId = this.master.salarySlabSelected['id'] ?? 0;
    this.hrmmasterService.getDesignationBySalarySlabId(slabId).subscribe((returns: any) => {
      this.DesignationList = returns.data.map((val: any) => ({
        id: val.designationName,
        name: val.designationName,
      }))
    })
  }
  salarySlabItems: [];
  public LoadSalarySlab() {
    this.salarySlabItems = [];
    this.master.salarySlabSelected = null;
    this.master.salarySlabId = null;
    this.master.DesignationSelected = null;
    this.DesignationList = [];
    this.salaryslabService.GetSalarySlabById(0, this.master.salaryGradeId).subscribe((returns: any) => {
      this.salarySlabItems = returns.data.map((val) => ({
        id: val.salarySlabId,
        name: val.slabName,
      }));
    });
  }
  public GetDesignationOnEdit() {
    debugger
    this.DesignationList = [];
    let slabId = this.master.salarySlabSelected['id'] ?? 0;
    this.hrmmasterService.getDesignationBySalarySlabId(slabId).subscribe((returns: any) => {
      this.DesignationList = returns.data.map((val: any) => ({
        id: val.designationName,
        name: val.designationName,
      }))
    })
  }
  public LoadSalarySlabEdit() {
    debugger
    this.salarySlabItems = [];
    this.salaryslabService.GetSalarySlabById(0, this.master.salaryGradeId).subscribe((returns: any) => {
      this.salarySlabItems = returns.data.map((val) => ({
        id: val.salarySlabId,
        name: val.slabName,
      }));
    });
  }

}
