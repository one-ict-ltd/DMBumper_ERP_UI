import { NbMenuItem } from "@nebular/theme";

console.log(NbMenuItem);
export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: "CORE SETTINGS",
    group: true,
  },
  {
    title: "ERP Setting",
    icon: "layout-outline",
    children: [
      {
        title: "Company",
        link: "/pages/settings/company",
      },
      {
        title: "Branch",
        link: "/pages/settings/branch",
      },
      {
        title: "Menu type",
        link: "/pages/settings/menutype",
      },
      {
        title: "Module",
        link: "/pages/settings/module",
      },
      {
        title: "Menu",
        link: "/pages/settings/menus",
      },
      {
        title: "User Group",
        link: "/pages/settings/usergroup",
      },
      {
        title: "User Create",
        link: "/pages/settings/usercreate",
      },
      {
        title: "User Register",
        link: "/pages/settings/userregister",
      },
      {
        title: "User Wise Company",
        link: "/pages/settings/userwisecompany",
      },
      {
        title: "Module Permission",
        link: "/pages/settings/modulepermission",
      },
      {
        title: "User Permission",
        link: "/pages/settings/userpermission",
      },
      {
        title: "Menu Permission",
        link: "/pages/settings/menupermission",
      },
      {
        title: "Report Name",
        link: "/pages/settings/reportname",
      },
      {
        title: "Report Permission",
        link: "/pages/settings/reportpermission",
      },
    ],
  },

  {
    title: "FINANCIAL ACCOUNTING",
    group: true,
  },
  {
    title: "Settings",
    icon: "layout-outline",
    children: [
      {
        title: "Voucher Type",
        link: "/pages/accounting/vouchertype",
      },
      {
        title: "Transaction Mode",
        link: "/pages/accounting/transactionmode",
      },
      {
        title: "Currency",
        link: "/pages/accounting/currency",
      },
      {
        title: "Fund Source",
        link: "/pages/accounting/fundsource",
      },
      {
        title: "Party",
        link: "/pages/accounting/party",
      },
      {
        title: "Local Agent Sync",
        link: "/pages/accounting/localagent",
      },
      {
        title: "Cost Centre",
        link: "/pages/accounting/costcentre",
      },
      {
        title: "Cost Centre Mapping",
        link: "/pages/accounting/costcentremapping",
      },
      {
        title: "Account Nature",
        link: "/pages/accounting/accountnature",
      },
      {
        title: "Account Group",
        link: "/pages/accounting/accountgroup",
      },
      {
        title: "Ledger Type",
        link: "/pages/accounting/ledgertype",
      },
      {
        title: "Ledger",
        link: "/pages/accounting/ledger",
      },
      {
        title: "Ledger Opening Balance",
        link: "/pages/accounting/ledgeropeningbalance",
      },
      {
        title: "Auto Voucher setting",
        link: "/pages/accounting/autovouchersetting",
      },
      {
        title: "Income Statement Note Master",
        link: "/pages/accounting/notemasterincomestment",
      },
      {
        title: "Income Statement Note Details",
        link: "/pages/accounting/notedetailsincomestment",
      },
      {
        title: "Balance Sheet Note Master",
        link: "/pages/accounting/notemasterblsheet",
      },
      {
        title: "Balance Sheet Note Details",
        link: "/pages/accounting/notedetailsblsheet",
      },
      {
        title: "Cash Flow (Direct) Note Master",
        link: "/pages/accounting/notemastercashflowdirect",
      },
      {
        title: "Cash Flow (Direct) Note Details",
        link: "/pages/accounting/notedetailscashflowdirect",
      },
      {
        title: "Cash Flow (Indirect) Note Master",
        link: "/pages/accounting/notemastercashflowindirect",
      },
      {
        title: "Cash Flow (Indirect) Note Details",
        link: "/pages/accounting/notedetailscashflowindirect",
      },
    ],
  },
  {
    title: "Transactions",
    icon: "layout-outline",
    children: [
      {
        title: "Voucher",
        link: "/pages/accounting/voucher",
      },
      {
        title: "Payment Voucher",
        link: "/pages/accounting/paymentvoucher",
      },
      {
        title: "Receive Voucher",
        link: "/pages/accounting/receivevoucher",
      },
      {
        title: "Journal Voucher",
        link: "/pages/accounting/journalvoucher",
      },
      {
        title: "Contra Voucher",
        link: "/pages/accounting/contravoucher",
      },
      {
        title: "Cheque Book",
        link: "/pages/accounting/chequebook",
      },
      {
        title: "Visa Work Order",
        link: "/pages/accounting/visaworkorder",
      },
      {
        title: "Visa Work Order Posting",
        link: "/pages/accounting/visaworkorderposting",
      },
      {
        title: "Visa Sales",
        link: "/pages/accounting/visasales",
      },
      {
        title: "Visa Sales Posting",
        link: "/pages/accounting/visasalesposting",
      },
      {
        title: "Dashboard",
        link: "/pages/accounting/accountdashboard",
      },
    ],
  },
  {
    title: "Budget",
    icon: "layout-outline",
    children: [
      {
        title: "Fiscal Year",
        link: "/pages/accounting/fiscalyear",
      },
      {
        title: "Budget Main Head",
        link: "/pages/accounting/budgetmainhead",
      },
      {
        title: "Budget Sub Head",
        link: "/pages/accounting/budgetsubhead",
      },
      {
        title: "Budget Head",
        link: "/pages/accounting/budgethead",
      },
      {
        title: "Budget Create",
        link: "/pages/accounting/budgetcreate",
      },
    ],
  },
  {
    title: "Reports",
    icon: "layout-outline",
    children: [
      {
        title: "Chart of Accounts",
        link: "/pages/accounting/rpt-coa",
      },
      {
        title: "Account Group Book",
        link: "/pages/accounting/rpt-accountgroupbook",
      },
      {
        title: "Ledger Book",
        link: "/pages/accounting/rpt-legderbook",
      },
      {
        title: "Party Ledger Book",
        link: "/pages/accounting/rpt-partyledgerbook",
      },
      {
        title: "Day Book",
        link: "/pages/accounting/rpt-daybook",
      },
      {
        title: "Cash Book",
        link: "/pages/accounting/rpt-cashbook",
      },
      {
        title: "Bank Book",
        link: "/pages/accounting/rpt-bankbook",
      },
      {
        title: "Trial Balance",
        link: "/pages/accounting/rpt-trialbalance",
      },
      {
        title: "Income Statement",
        link: "/pages/accounting/rpt-incomestatement",
      },
      {
        title: "Income Statement (Gross Format)",
        link: "/pages/accounting/rpt-incomestmentgrossformat",
      },
      {
        title: "Balance Sheet",
        link: "/pages/accounting/rpt-balancesheet",
      },
      {
        title: "Balance Sheet Two",
        link: "/pages/accounting/rpt-balancesheettwo",
      },
      {
        title: "Balance Sheet (Detail)",
        link: "/pages/accounting/rpt-balancesheetdetail",
      },
      {
        title: "Cash Flow Statement (Direct)",
        link: "/pages/accounting/rpt-cashflowdirect",
      },
      {
        title: "Cash Flow Statement (Indirect)",
        link: "/pages/accounting/rpt-cashflowindirect",
      },
      {
        title: "Payment Receive",
        link: "/pages/accounting/rpt-paymentreceived",
      },
      {
        title: "Stock Report",
        link: "/pages/accounting/rpt-visastock",
      },
      {
        title: "Purchase Report",
        link: "/pages/accounting/rpt-visapurchase",
      },
      {
        title: "Sales Report",
        link: "/pages/accounting/rpt-visasales",
      },
      {
        title: "Payment Receive New Report",
        link: "/pages/accounting/rpt-paymentreceivenew",
      },
    ],
  },
  {
    title: "INVENTORY",
    group: true,
  },
  {
    title: "Settings",
    icon: "layout-outline",
    children: [
      {
        title: "Product Category",
        link: "/pages/inventory/productcategory",
      },
      {
        title: "Product Sub Category",
        link: "/pages/inventory/productsubcategory",
      },
      {
        title: "Product Brand",
        link: "/pages/inventory/productbrand",
      },
      {
        title: "Product Model",
        link: "/pages/inventory/productmodel",
      },
      {
        title: "Product UOM",
        link: "/pages/inventory/productuom",
      },
      {
        title: "Product Discount Type",
        link: "/pages/inventory/productdiscounttype",
      },
      {
        title: "Product Type",
        link: "/pages/inventory/producttype",
      },
      {
        title: "Product Color",
        link: "/pages/inventory/productcolor",
      },
      {
        title: "Product Size",
        link: "/pages/inventory/productsize",
      },
    ],
  },
  {
    title: "Product",
    icon: "layout-outline",
    children: [
      {
        title: "Product",
        link: "/pages/inventory/product",
      },
    ],
  },
  {
    title: "PURCHASE",
    group: true,
  },
  {
    title: "Settings",
    icon: "layout-outline",
    children: [
      {
        title: "Product Requisition",
        link: "/pages/purchase/productrequisition",
      },
      {
        title: "Purchase Requisition",
        link: "/pages/purchase/purchaserequisition",
      },
      {
        title: "Purchase Order Receive",
        link: "/pages/purchase/purchaseorderreceive",
      },
      {
        title: "Purchase Order",
        link: "/pages/purchase/purchaseorder",
      },
    ],
  },

  {
    title: "HELP MODULE",
    group: true,
  },
  {
    title: "Client",
    icon: "layout-outline",
    children: [
      {
        title: "Create client",
        icon: "edit-2-outline",
        link: "/pages/client/create-client",
      },
      {
        title: "create transaction",
        icon: "edit-2-outline",
        link: "/pages/client/client-transection",
      },
    ],
  },
];
