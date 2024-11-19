export interface IProductGroup {
    groupId: string;
  groupCode: string;
  subCode: string;
  groupName: string;
  isSubGroup: boolean;
  isChecked: boolean;
  isCollapsed: boolean;
  isIndeterminate: boolean;
  subCategories?: IProductSubGroup[];
}

export interface IProductSubGroup{
  groupId: string;
  groupCode: string;
  subCode: string;
  groupName: string;
  isChecked: boolean;
}

