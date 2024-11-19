export interface IAnalysisTable{
  tableId: string;
  tableName: string;
  entries: IAnalysisEntries[];
  isChecked?: boolean;
  isCollapsed : boolean;
}

export interface IAnalysisEntries{
  tableId: string;
  entryId?: string;
  entryName?: string;
  isChecked?: boolean;
}
