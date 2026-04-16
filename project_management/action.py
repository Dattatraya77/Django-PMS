from django.shortcuts import get_object_or_404
from project_management.models import TaskLogHistory, ProjectLogHistory
import datetime


def createTaskLogHistory(request, project_id, task_id, task_log_status, task_log_message):
    create_task_log_history = TaskLogHistory.objects.create(
        task_log_created_by=request.user,
        task_log_created_at=datetime.datetime.now(),
        task_log_status=task_log_status,
        task_log_message=task_log_message,
        project_id = project_id,
        task_id=task_id
    )

    return True


def createProjectLogHistory(request, project_id, project_log_status, project_log_message):
    create_project_log_history = ProjectLogHistory.objects.create(
        project_log_created_by=request.user,
        project_log_created_at=datetime.datetime.now(),
        project_log_status=project_log_status,
        project_log_message=project_log_message,
        project_id = project_id,
    )

    return True