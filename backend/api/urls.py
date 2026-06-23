from django.urls import path
from drf_spectacular.views import SpectacularAPIView

from .views import TaskStatus

urlpatterns = [
    path(
        route="tasks/status/<uuid:task_id>",
        view=TaskStatus.as_view(),
        name="task_status",
    ),
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
]
