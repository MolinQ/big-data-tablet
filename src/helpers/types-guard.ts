import { VARIABLES_TYPES } from "@/constants/variables-types";

export function isFunction(value: unknown): value is (...args: any) => any {
  return typeof value === VARIABLES_TYPES.FUNCTION;
}

