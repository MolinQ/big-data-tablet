import { TEXT_EMPTY_FIELDS } from "./initial-components-value";

export const USER_SORTING_FIELDS = new Set([
  "name",
  "age",
  "email",
  "phone",
  "gender",
]);

export const INITIAL_PAGE_PARAM = 1;

export const QUERRY_KEY = ["tableData"];

export enum SORTING_TYPES {
  ASC = "asc",
  DESC = "desc",
  DEFAULT = "",
}

export const PAGINATION_PARAMS = {
  DEFAULT_PAGE: "1",
  DEFAULT_LIMIT: "10",
};

export const SORTED_BY_PARAMS = {
  NAME: "sortBy",
  DEFAULT_FIELD: "id",
};
export const SORTED_ORDER_PARAMS = {
  NAME: "sortOrder",
  DEFAULT_FIELD: SORTING_TYPES.ASC,
};
export const SEARCH_TEXT_PARAMS = {
  NAME: "search",
  DEFAULT_FIELD: TEXT_EMPTY_FIELDS,
};

export const SEARCH_PARAMS = {
  PAGE: "page",
  LIMIT: "limit",
  DEFAULT_VALUE: 20,
};
