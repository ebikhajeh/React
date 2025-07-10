
// hooks/useCashiers.ts
import { useQuery } from "@tanstack/react-query";
import { Cashier } from "../types/cashier";
import { ApiResponse } from "../types/apiResponse";
import cashierService from "../services/cashierService";

export const useCashiers = () => {
  return useQuery<ApiResponse<Cashier[]>>({
    queryKey: ["cashiers"],
    queryFn: () => cashierService.getAll(),
  });
};
