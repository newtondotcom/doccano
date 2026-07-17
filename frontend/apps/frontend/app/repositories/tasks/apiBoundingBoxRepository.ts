import { AnnotationRepository } from "@/domain/models/tasks/annotationRepository";
import { BoundingBox } from "@/domain/models/tasks/boundingBox";

export class APIBoundingBoxRepository extends AnnotationRepository<BoundingBox> {
  override labelName = "bboxes";

  override toModel(item: { [key: string]: any }): BoundingBox {
    return new BoundingBox(item.id, item.uuid, item.label, item.x, item.y, item.width, item.height);
  }

  override toPayload(item: BoundingBox): { [key: string]: any } {
    return {
      id: item.id,
      uuid: item.uuid,
      label: item.label,
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
    };
  }
}
