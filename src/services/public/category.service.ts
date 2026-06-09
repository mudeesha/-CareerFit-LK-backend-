import { findCategories } from "../../repositories/public/category.repository";

export async function getCategoriesService() {
  const categories = await findCategories();

  return {
    items: categories,
    count: categories.length,
  };
}