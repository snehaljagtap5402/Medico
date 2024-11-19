import { IProductImage } from "./iproduct-image";

export interface IProductDetails {
    stockId: string;
    brand: string;
    productCode: string;
    unitPerCase: number;
    packSize: number;
    barcodeEAN: string;
    barcodeITF: string;
    caseWeight: number;
    cBM: number;
    palletQty: number;
    mOQ: number;
    layerQty: number;
    tariffCodes: number;
    countryOfOrigin: string;
    live: boolean;
    description: string;
    imagePath: string;
    shortDescription: string;
    summary: string;
    images: IProductImage[];
}
