import { AnnotationRepository } from "@/domain/models/tasks/annotationRepository";
import { Relation } from "@/domain/models/tasks/relation";

export class APIRelationRepository extends AnnotationRepository<Relation> {
  override labelName = "relations";

  override toModel(item: { [key: string]: any }): Relation {
    return new Relation(item.id, item.from_id, item.to_id, item.type);
  }

  override toPayload(item: Relation): { [key: string]: any } {
    return {
      id: item.id,
      from_id: item.fromId,
      to_id: item.toId,
      type: item.type,
    };
  }
}
