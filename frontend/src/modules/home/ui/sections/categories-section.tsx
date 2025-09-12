"use client";

import FilterCarousel from "@/components/filter-carousel";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface CategoriesSectionProps {
  categoryId?: string;
}

interface CategoryResponse {
  id: string;
  name: string;
}

function CategoriesSection({ categoryId }: CategoriesSectionProps) {
  const fetchCategories = async (): Promise<CategoryResponse[]> => {
    const data = (
      await axios.get(
        `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/category`
      )
    ).data;

    return data.categoryList;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  let categories = undefined;
  if (data) {
    categories = data?.map(({ id, name }) => ({
      label: name,
      value: id,
    }));
  }

  return (
    <FilterCarousel
      value={categoryId}
      data={categories || []}
      isLoading={isLoading}
    />
  );
}

export default CategoriesSection;
