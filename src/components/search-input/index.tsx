"use client";

import { SEARCH_TEXT_PARAMS } from "@/constants/users-params-data";
import { debounce } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const SearchInput = ({
  inputWrClasses,
  customPlaceholder,
}: {
  inputWrClasses: string;
  customPlaceholder?: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch =
    searchParams.get(SEARCH_TEXT_PARAMS.NAME) ||
    SEARCH_TEXT_PARAMS.DEFAULT_FIELD;
  const [searchText, setSearchText] = useState(initialSearch);

  const updateQuery = useMemo(() => {
    return debounce((value: string) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));

      if (value) {
        params.set(SEARCH_TEXT_PARAMS.NAME, value);
      } else {
        params.delete(SEARCH_TEXT_PARAMS.NAME);
      }

      router.push(`?${params.toString()}`);
    }, 500);
  }, [router, searchParams]);

  useEffect(() => {
    updateQuery(searchText);
    return () => updateQuery.cancel();
  }, [searchText, updateQuery]);

  return (
    <div className={`${inputWrClasses} relative`}>
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
          />
        </svg>
      </span>
      <input
        type="text"
        placeholder={customPlaceholder ? customPlaceholder : "Search..."}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
    </div>
  );
};

export default SearchInput;
