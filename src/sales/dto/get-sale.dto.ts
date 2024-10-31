import { isNumber } from "class-validator";
import { Sale } from "../entities/sale.entity";

export type Ganancias = {
    costoTotalVenta: number;
    ganancia?: number;
    priceProduct: number;
    costoTotalCompra
}