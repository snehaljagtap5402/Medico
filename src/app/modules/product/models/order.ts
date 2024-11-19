export interface IOrder{
    idAccount: number;
    custName: string;
    date: string;
    lastchanged: string;
    //ackdate: string;
    notes: string;
    custRef: string;
    idAddress: number;
    Status: string;
    //OrderNo:string;
    Lines: ILines[]
  }
  
  export interface ILines {
      cartItemId: number;
      productRef: string;
      aliasId: string;
      reference: string;
      desc: string;
      average: number;
      sellPrice: number;
      quantity: number;
      totalLine: number;
      cartId: number;
      DiscCode: string;
      costprice: number;
      lineNumber: number;
      text: string;
      UnitPrice: number;
    }