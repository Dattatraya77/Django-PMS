from django.contrib import admin
from .models import *


@admin.register(ProjectTemplate)
class ProjectTemplateAdmin(admin.ModelAdmin):
    list_display = ('proj_temp_id', 'proj_temp_status', 'proj_temp_title', 'proj_temp_description', 'proj_temp_owner', 'proj_temp_created_at',
                    'proj_temp_edited_by', 'proj_temp_edited_on', 'proj_temp_display_group')


admin.site.register(FieldChoice)


@admin.register(ProjectField)
class ProjectFieldAdmin(admin.ModelAdmin):
    list_display = ('field_id', 'field_title', 'field_description', 'field_type', 'field_origin')


@admin.register(ProjectTemplateField)
class ProjectTemplateFieldAdmin(admin.ModelAdmin):
    list_display = ('proj_template_id', 'proj_temp', 'proj_temp_field', 'proj_temp_field_position', 'proj_temp_field_hide')


admin.site.register(ProjectStatus)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('proj_id', 'proj_name', 'proj_description', 'proj_owner', 'proj_start_date', 'proj_end_date',
                    'proj_status', 'proj_origin', 'proj_doc_display_group', 'proj_deleted', 'proj_archive')


admin.site.register(TaskStatus)
admin.site.register(TaskPriority)


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'text', 'start_date', 'end_date', 'parent', 'project',
                    'status', 'created_by', 'priority', 'task_extra_column', 'task_deleted', 'is_section', 'section_label', 'section_metadata')


@admin.register(Link)
class LinkAdmin(admin.ModelAdmin):
    list_display = ('id', 'source', 'target', 'type', 'lag')


admin.site.register(NotifyWhenChoice)


@admin.register(NotificationData)
class NotificationDataAdmin(admin.ModelAdmin):
    list_display = ('notification_data_proj_id', 'notification_data')


@admin.register(ProjectTaskNotification)
class ProjectTaskNotificationAdmin(admin.ModelAdmin):
    list_display = ('notify_proj_id', 'notify', 'notify_display_group', 'notify_other')


@admin.register(TaskLogHistory)
class TaskLogHistoryAdmin(admin.ModelAdmin):
    list_display = ('task_log_id', 'project_id', 'task_id', 'task_log_created_by', 'task_log_created_at', 'task_log_message', 'task_log_status')


@admin.register(SectionTemplateMetadata)
class SectionTemplateMetadataAdmin(admin.ModelAdmin):
    list_display = ('section_temp_meta_id', 'section_task_metadata', 'section_task_id', 'section_temp_meta_position', 'section_temp_meta_choices', 'section_temp_meta_config')


@admin.register(SectionMetadataValues)
class SectionMetadataValuesAdmin(admin.ModelAdmin):
    list_display = ('section_meta_val_id', 'section_task_metadata', 'section_metadata_type', 'section_metadata_value', 'section_task_id', 'section_meta_val_position')
    search_fields = ('section_metadata_value', 'section_task_id')
    list_filter = ('section_task_metadata',)


@admin.register(MetadataTracking)
class MetadataTrackingAdmin(admin.ModelAdmin):
    list_display = ('id', 'task', 'get_field_title', 'changed_field', 'old_value', 'new_value', 'changed_by', 'changed_at')

    def get_field_title(self, obj):
        if obj.section_metadata_value and obj.section_metadata_value.section_task_metadata:
            return str(obj.section_metadata_value.section_task_metadata.field_id)+"/"+str(obj.section_metadata_value.section_task_metadata.field_title)
        return "-"

    get_field_title.short_description = 'Field ID/Field Title'


@admin.register(SectionMasterChoice)
class SectionMasterChoiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'master_choice', 'special_char_choice')


@admin.register(SectionMaster)
class SectionMasterAdmin(admin.ModelAdmin):
    list_display = ('id', 'section_master_name', 'section_sub_metadata_name', 'section_sub_choice', 'is_sub_choice', 'section_master_metadata_name', 'is_completed')


@admin.register(ProjectLogHistory)
class ProjectLogHistoryAdmin(admin.ModelAdmin):
    list_display = ('project_log_id', 'project_id', 'project_log_created_by', 'project_log_created_at', 'project_log_message', 'project_log_status')

