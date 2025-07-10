
import { cashier } from "../types/cashier";
import HttpService from "./httpService";

const cashierService = new HttpService<cashier>("/cashier");

export default cashierService;
