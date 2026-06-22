from model_bakery import baker

from projects.models import ProjectType


def make_label(project, **kwargs):
    if project.project_type.endswith("Classification") or project.project_type in {
        ProjectType.BOUNDING_BOX,
        ProjectType.SEGMENTATION,
    }:
        return baker.make("CategoryType", project=project, **kwargs)
    else:
        return baker.make("SpanType", project=project, **kwargs)
