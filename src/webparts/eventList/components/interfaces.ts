type warning = 'warning';
type main = 'main';

export type IWindow = warning | main;

interface IC {
  warning: warning;
  main: main;
}

export const C: IC = {
  warning: 'warning',
  main: 'main',
};


export interface IEvent{
  Name:string;
  Movie:string;
  Category:string;
  Datetime:string;
  Actions:string;
}


export interface ISearchResponse {
  'odata.metadata': string;
  ElapsedTime: number;
  PrimaryQueryResult: PrimaryQueryResult;
  Properties: Property[];
  SecondaryQueryResults: any[];
  SpellingSuggestion: string;
  TriggeredRules: any[];
}

interface PrimaryQueryResult {
  CustomResults: any[];
  QueryId: string;
  QueryRuleId: string;
  RefinementResults: RefinementResults;
  RelevantResults: RelevantResults;
  SpecialTermResults?: any;
}

interface RelevantResults {
  GroupTemplateId?: any;
  ItemTemplateId?: any;
  Properties: Property[];
  ResultTitle?: any;
  ResultTitleUrl?: any;
  RowCount: number;
  Table: Table;
  TotalRows: number;
  TotalRowsIncludingDuplicates: number;
}

interface Table {
  Rows: Row[];
}

interface Row {
  Cells: Cell[];
}

interface Cell {
  Key: string;
  Value?: string;
  ValueType: string;
}

interface RefinementResults {
  GroupTemplateId?: any;
  ItemTemplateId?: any;
  Properties: Property[];
  Refiners: Refiner[];
  ResultTitle?: any;
  ResultTitleUrl?: any;
}

interface Refiner {
  Entries: Entry[];
  Name: string;
}

interface Entry {
  RefinementCount: string;
  RefinementName: string;
  RefinementToken: string;
  RefinementValue: string;
}

interface Property {
  Key: string;
  Value: string;
  ValueType: string;
}