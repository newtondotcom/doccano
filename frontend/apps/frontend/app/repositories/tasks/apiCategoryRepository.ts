import { AnnotationRepository } from "@/domain/models/tasks/annotationRepository";
import { Category } from "@/domain/models/tasks/category";

export class APICategoryRepository extends AnnotationRepository<Category> {
  override labelName = "categories";

  override toModel(item: { [key: string]: any }): Category {
    return new Category(item.id, item.label, item.user);
  }

  override toPayload(item: Category): { [key: string]: any } {
    return {
      id: item.id,
      label: item.label,
      user: item.user,
    };
  }
}
