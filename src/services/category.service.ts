import { findCategories } from "../repositories/category.repository";

export async function getCategoriesService() {
  const categories = await findCategories();

  return {
    items: categories,
    count: categories.length,
  };
}