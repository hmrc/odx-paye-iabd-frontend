export interface TESObject {
  pyKeyString: string;
  Language: string;
  Name: string;
  pyURLContent?: string;
}
export interface TESLinkContent {
  Content: TESObject[];
}

export interface DetailsTypes {
  Status: string;
  ActiveOccupationalPension: boolean;
  EmployerName: string;
  StartDate: string;
  EndDate: string;
  P45Amount: string;
  EstimatedPay: string;
  AssignedTaxCode: string;
  TESLinks: TESLinkContent[];
  PayRollID: string;
  PAYENumber: string;
  EstimatedPayInterruptionFlag: boolean;
  EmploymentSequenceNumber: string;
}

export interface CurrentListOBJ {
  EmploymentName?: string;
  Amount: number;
  Content: TESObject[];
  TESLinks?: TESLinkContent[];
}

type TaxSummaryListObj = {
  CurrentBenefitsList: CurrentListOBJ[];
  CurrentIncomeList: CurrentListOBJ[];
  CurrentAllowanceList: CurrentListOBJ[];
  CurrentDeductionsList: CurrentListOBJ[];
};

type CustomerType = {
  TaxSummaryList: TaxSummaryListObj[];
};
type ErrMessage = {
  pyMessage: string;
};

type pyErrorMessage = {
  pyErrorMessage: ErrMessage[];
};

type pyMessages = {
  pyMessages: pyErrorMessage[];
};

export type AllIABDDetails = {
  Customer?: CustomerType;
  pyErrors?: pyMessages;
};

export type WIMTCDetails = {
  data?: WIMTCData[];
};

export type WIMTCData = {
  pyErrors?: pyMessages;
  Customer?: WITMCCustomer;
};

export type WITMCCustomer = {
  TaxSummaryList?: TaxCodeSummaryList[];
};

export type TaxDetailObject = {
  pyNote: string;
  NetCodedAllowance: string;
  AssignedTaxCode: string;
};
export type TaxCodeSummaryList = {
  CurrentAllowanceList?: AllowanceObject[];
  CurrentDeductionsList?: AllowanceObject[];
  PersonalAllowances?: AllowanceObject[];
  TaxDetails?: TaxDetailObject[];
  TaxAttribute?: string[];
};
export type ContentObject = {
  pyKeyString: string;
  Language: string;
  Name: string;
};
export type AllowanceObject = {
  Content?: ContentObject[];
  AdjustedAmount?: string;
  TESLinks?: TESLinkContent[];
};
