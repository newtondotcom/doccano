from model_bakery import baker


def make_comment(doc, user):
    return baker.make("Comment", example=doc, user=user)


def make_doc(project):
    return baker.make("Example", text="example", project=project)


def make_image(project, filepath):
    return baker.make("Example", filename=filepath, project=project)


def make_example_state(example, user):
    return baker.make("ExampleState", example=example, confirmed_by=user)


def make_assignment(project, example, user):
    return baker.make("Assignment", project=project, example=example, assignee=user)
