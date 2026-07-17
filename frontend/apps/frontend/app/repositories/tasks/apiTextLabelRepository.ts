import { AnnotationRepository } from "@/domain/models/tasks/annotationRepository";
import { TextLabel } from "@/domain/models/tasks/textLabel";

export class APITextLabelRepository extends AnnotationRepository<TextLabel> {
  override labelName = "texts";

  override toModel(item: { [key: string]: any }): TextLabel {
    return new TextLabel(item.id, item.text, item.user);
  }

  override toPayload(item: TextLabel): { [key: string]: any } {
    return {
      id: item.id,
      text: item.text,
      user: item.user,
    };
  }
}
