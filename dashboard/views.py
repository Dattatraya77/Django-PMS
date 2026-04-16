from project_management.models import Project, Task
from project_management_system.settings import MEDIA_ROOT
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import View
from django.shortcuts import redirect, get_object_or_404
from django.db import connection
import os
from users.models import Profile
from django.contrib.auth.models import User, Group
from django.shortcuts import render
from django.db.models import Q
from timezonefinder import TimezoneFinder


class SearchDashboard(LoginRequiredMixin, View):

    def get(self, request):
        user = self.request.user
        log_file_path = MEDIA_ROOT + '/' + connection.tenant.name

        # Create the tenant directories
        if connection.tenant.first_visit:
            if not os.path.isdir(log_file_path):
                os.mkdir(log_file_path)
                # Add tenant time zone to the user time zone
                user_profile = get_object_or_404(Profile, user=self.request.user)
                tenant_tz = connection.tenant.client_tz
                user_profile.client_tz = tenant_tz
                user_profile.save()
            if not os.path.isdir(log_file_path + '/created_documents'):
                os.mkdir(log_file_path + '/created_documents')
            if not os.path.isdir(log_file_path + '/templates'):
                os.mkdir(log_file_path + '/templates')
            try:
                Group.objects.create(name='COMMON')
                Group.objects.create(name='DOC_ADMIN')
            except:
                pass

            connection.tenant.first_visit = False
            connection.tenant.save()

        admin_group = get_object_or_404(Group, name='DOC_ADMIN')
        common_group = get_object_or_404(Group, name='COMMON')

        user_groups = request.user.groups.all()

        # Base filters
        project_filter = Q(proj_deleted=False, proj_archive=False)
        task_filter = Q(
            project__proj_deleted=False,
            project__proj_archive=False,
            task_deleted=False
        )

        # Admin User
        if admin_group in user_groups:
            total_projects = Project.objects.filter(project_filter).count()

            total_tasks = Task.objects.filter(task_filter).distinct().count()

            users = User.objects.all().order_by("id")
            total_user = User.objects.filter(is_active=True).count()

        # Non-Admin User
        else:

            total_projects = Project.objects.filter(
                project_filter &
                (
                        Q(proj_doc_group__in=user_groups) |
                        Q(proj_doc_group=common_group)
                )
            ).distinct().count()

            total_tasks = Task.objects.filter(
                task_filter &
                (
                        Q(project__proj_doc_group__in=user_groups) |
                        Q(project__proj_doc_group=common_group)
                )
            ).distinct().count()

            if request.user.is_staff:
                users = User.objects.all().order_by("id")
                total_user = User.objects.filter(is_active=True).count()

            else:
                users = User.objects.filter(
                    Q(groups__in=user_groups) |
                    Q(groups=common_group)
                ).distinct().order_by("id")

                total_user = User.objects.filter(
                    Q(is_active=True, groups__in=user_groups) |
                    Q(groups=common_group)
                ).distinct().count()

        context = {
            "total_projects": total_projects,
            "total_tasks": total_tasks,
            "users": users,
            "total_user": total_user,
            'client_name': connection.tenant.name,
            "get_request": True,
        }
        return render(request, 'search_dashboard.html', context)


class GetTimeZone(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        try:
            latitude = request.GET.get('latitude')
            longitude = request.GET.get('longitude')
            tf = TimezoneFinder()
            tz = tf.timezone_at(lng=float(longitude), lat=float(latitude))
            return JsonResponse({'success': True, 'tz': str(tz)})
        except Exception as e:
            print("error:->",e)
            return JsonResponse({'success': False, 'error': str(e)})
