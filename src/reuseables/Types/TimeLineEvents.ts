export type TimeLineEvent = {
  DisplayDate?: string;
  pyNote?: string;
  Content?: TimeLineContentObj[];
  pyTempDate?: string;
  StringSortingHolder?: string;
  issuedtaxCode?: string;
  EmployerName?: string;
  contactTime?: string;
  pyActionType?: string;
  pyCategory?: string;
  pyTemplateDataField?: string;
  ActiveOccupationalPension?: boolean;
  NetCodedAllowance?: string;
  IntegerSortingHolder?: number;
  EmploymentType?: string;
  EmploymentSequenceNumber?: number;
};

export type TimeLineEvents = TimeLineEvent[];

export type TimeLineContentObj = {
  pyKeyString?: string;
  Description?: string;
  Language?: string;
};
