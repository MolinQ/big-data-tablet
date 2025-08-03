import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  PAGINATION_PARAMS,
  SEARCH_PARAMS,
  SEARCH_TEXT_PARAMS,
  SORTED_BY_PARAMS,
  SORTED_ORDER_PARAMS,
  SORTING_TYPES,
  USER_SORTING_FIELDS,
} from "@/constants/users-params-data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(
      searchParams.get(SEARCH_PARAMS.PAGE) || PAGINATION_PARAMS.DEFAULT_PAGE
    );
    const limit = parseInt(
      searchParams.get(SEARCH_PARAMS.LIMIT) || PAGINATION_PARAMS.DEFAULT_LIMIT
    );
    const search =
      searchParams.get(SEARCH_TEXT_PARAMS.NAME)?.trim() ||
      SEARCH_TEXT_PARAMS.DEFAULT_FIELD;

    const skip = (page - 1) * limit;

    const sortBy =
      searchParams.get(SORTED_BY_PARAMS.NAME) || SORTED_BY_PARAMS.DEFAULT_FIELD;
    const sortOrder =
      searchParams.get(SORTED_ORDER_PARAMS.NAME) ||
      SORTED_ORDER_PARAMS.DEFAULT_FIELD;

    const safeSortBy = USER_SORTING_FIELDS.has(sortBy)
      ? sortBy
      : SORTED_BY_PARAMS.DEFAULT_FIELD;
    const safeSortOrder =
      sortOrder === SORTING_TYPES.DESC ? SORTING_TYPES.DESC : SORTING_TYPES.ASC;

    const data = await prisma.tableData.findMany({
      skip,
      take: limit,
      orderBy: [
        { [safeSortBy]: safeSortOrder },
        { id: SORTING_TYPES.ASC ?? undefined },
      ],
      where: search
        ? {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }
        : undefined,
    });

    const totalCount = await prisma.tableData.count({
      where: search
        ? {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }
        : undefined,
    });

    return NextResponse.json({
      results: data,
      nextPage: skip + limit < totalCount ? page + 1 : null,
    });
  } catch (error) {
    console.error("Request error", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
