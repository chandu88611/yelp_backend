import dataSource from "ormconfig";
import { ILike, In } from "typeorm";
import { Category } from "~/packages/database/models/Category";

export class CategoryService {
  private categoryRepository = dataSource.getRepository(Category);

  async createCategory(name: string): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne({ where: { name } });
    if (existingCategory) {
      throw new Error("Category already exists.");
    }

    const newCategory = this.categoryRepository.create({ name });
    return await this.categoryRepository.save(newCategory);
  }

  async getCategoriesByIds(categoryIds: string[]): Promise<Category[]> {
    if (!categoryIds || categoryIds.length === 0) return [];
    return await this.categoryRepository.findBy({ id: In(categoryIds) });
  }

  async getAllCategories(search: string = "", page: number = 1, limit: number = 10): Promise<{ data: Category[]; total: number }> {
    const [data, total] = await this.categoryRepository.findAndCount({
      where: search ? { name: ILike(`%${search}%`) } : {},
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  async updateCategory(id: string, name: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new Error("Category not found.");
    }

    category.name = name;
    return await this.categoryRepository.save(category);
  }

  async deleteCategory(id: string): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
