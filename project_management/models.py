from django.db import models
from django.contrib.auth.models import User, Group
import collections
from jsonfield import JSONField
from multi_email_field.fields import MultiEmailField
from django.contrib.postgres.fields import ArrayField
from django.utils.timezone import now


PROJECT_TEMPLATE_STATUS = (
	('ac', 'Active'),
	('ia', 'Inactive'),
	('de', 'Deleted'),
	('pe', 'Pending')
)


class ProjectTemplate(models.Model):
	proj_temp_id = models.CharField(max_length=64, primary_key=True, unique=True)
	proj_temp_status = models.CharField(
		max_length=2,
		choices=PROJECT_TEMPLATE_STATUS,
		default='pe'
	)
	proj_temp_title = models.CharField(max_length=100, default='project title for template')
	proj_temp_description = models.CharField(max_length=400, default='project description for template')
	proj_temp_owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
	proj_temp_created_at = models.DateTimeField(auto_now_add=True)
	proj_temp_edited_by = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='project_template_edited_by', null=True, blank=True)
	proj_temp_edited_on = models.DateTimeField(auto_now=True)
	proj_temp_doc_group = models.ManyToManyField(Group, blank=True)

	def __str__(self):
		return self.proj_temp_title

	def proj_temp_display_group(self):
		return ', '.join(group.name for group in self.proj_temp_doc_group.all())

	proj_temp_display_group.short_description = 'Groups'


FIELD_TYPE = (
	('string', 'String'),
	('number', 'Number'),
	('date', 'Date'),
	('bool', 'Boolean'),
	('single-select', 'Single-Select'),
	('multi-select', 'Multi-Select'),
	('textarea', 'TextArea'),
	('people', 'People'),
	('signature', 'Signature'),
)


class FieldChoice(models.Model):
	f_choice = models.CharField(max_length=250, unique=True)

	def __str__(self):
		return self.f_choice


class ProjectField(models.Model):
	field_id = models.AutoField(primary_key=True)
	field_title = models.CharField(max_length=100, unique=True)
	field_description = models.CharField(max_length=200, blank=True)
	field_type = models.CharField(max_length=20, choices=FIELD_TYPE)
	field_origin = models.ForeignKey(ProjectTemplate, on_delete=models.SET_NULL, null=True, blank=True)
	field_choice = models.ManyToManyField(FieldChoice, blank=True)

	def __str__(self):
		return self.field_title


class ProjectTemplateField(models.Model):
	proj_template_id = models.AutoField(primary_key=True)
	proj_temp = models.ForeignKey(ProjectTemplate, on_delete=models.CASCADE, verbose_name='Project Template ID')
	proj_temp_field = models.ForeignKey(ProjectField, on_delete=models.CASCADE)
	proj_temp_field_position = models.CharField(max_length=20, null=True, blank=True)
	proj_temp_field_hide = models.BooleanField(default=False)
	proj_temp_field_editable = models.ManyToManyField(Group, blank=True)

	def __str__(self):
		return self.proj_temp.proj_temp_title


class ProjectStatus(models.Model):
	proj_status = models.CharField(max_length=100)

	def __str__(self):
		return "{0}".format(self.proj_status)


class Project(models.Model):
	proj_id = models.AutoField(primary_key=True)
	proj_name = models.CharField(max_length=100)
	proj_description = models.CharField(max_length=400, default='project description for template')
	proj_owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
	proj_start_date = models.DateTimeField(auto_now_add=True)
	proj_end_date = models.DateTimeField(null=True, blank=True)
	proj_status = models.ForeignKey(ProjectStatus, null=True, blank=True, on_delete=models.SET_NULL)
	proj_origin = models.ForeignKey(ProjectTemplate, on_delete=models.SET_NULL, null=True, blank=True)
	proj_doc_group = models.ManyToManyField(Group, blank=True)
	proj_deleted = models.BooleanField(default=False)
	proj_archive = models.BooleanField(default=False)
	proj_signature = models.CharField(max_length=100, null=True, blank=True)
	proj_section_master_name = models.CharField(max_length=100, null=True, blank=True)
	proj_dropdown_field = models.CharField(max_length=100, null=True, blank=True)
	proj_lock = models.BooleanField(default=False)

	def __str__(self):
		return self.proj_name

	def proj_doc_display_group(self):
		return ', '.join(group.name for group in self.proj_doc_group.all())

	proj_doc_display_group.short_description = 'Groups'


class TaskStatus(models.Model):
	task_status = models.CharField(max_length=100)

	def __str__(self):
		return "{0}".format(self.task_status)


class TaskPriority(models.Model):
	task_priority = models.CharField(max_length=100)

	def __str__(self):
		return "{0}".format(self.task_priority)


class Task(models.Model):
	id = models.AutoField(primary_key=True)
	text = models.CharField(blank=True, max_length=1000)
	start_date = models.DateTimeField(null=True, blank=True)
	end_date = models.DateTimeField(null=True, blank=True)
	duration = models.IntegerField(default=0)
	progress = models.FloatField(default=0.0)
	parent = models.CharField(max_length=100)
	sort_order = models.IntegerField(default=0)
	project = models.ForeignKey(Project, on_delete=models.CASCADE, null=True, blank=True)
	status = models.ForeignKey(TaskStatus, null=True, blank=True, on_delete=models.SET_NULL)
	created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='task_created_by')
	assigned_to = models.ManyToManyField(User, blank=True)
	note = models.TextField(blank=True, null=True)
	priority = models.ForeignKey(TaskPriority, null=True, blank=True, on_delete=models.SET_NULL)
	task_extra_column = JSONField(null=True, blank=True, load_kwargs={'object_pairs_hook': collections.OrderedDict})
	task_deleted = models.BooleanField(default=False)
	is_section = models.BooleanField(default=False)
	section_metadata = JSONField(null=True, blank=True, load_kwargs={'object_pairs_hook': collections.OrderedDict})
	section_label = JSONField(null=True, blank=True, load_kwargs={'object_pairs_hook': collections.OrderedDict})


class Link(models.Model):
	id = models.AutoField(primary_key=True)
	source = models.CharField(max_length=100)
	target = models.CharField(max_length=100)
	type = models.CharField(max_length=100)
	lag = models.IntegerField(blank=True, default=0)


class NotifyWhenChoice(models.Model):
	notify_choice = models.CharField(max_length=250, unique=True)

	def __str__(self):
		return self.notify_choice


class NotificationData(models.Model):
	notification_data_proj_id = models.CharField(max_length=100)
	notification_data = models.TextField(blank=True, null=True)


class ProjectTaskNotification(models.Model):
	notify_proj_id = models.CharField(max_length=100)
	notify = models.BooleanField(default=False)
	notify_groups = models.ManyToManyField(Group, blank=True)
	notify_other = MultiEmailField(null=True, blank=True)
	notify_when_choice = models.ManyToManyField(NotifyWhenChoice, blank=True)

	def notify_display_group(self):
		return ', '.join(group.name for group in self.notify_groups.all())

	notify_display_group.short_description = 'Groups'


TASK_LOG_STATUS = (
	('TASK_ADD', 'Task Added'),
	('TASK_UPD', 'Task Updated'),
	('TASK_DEL', 'Task Deleted'),
	('TASK_COMP', 'Task Completed'),
	('TASK_DUPL', 'Task Duplicated'),
	('ATCH_ADD', 'Attachment Added'),
	('ATCH_DEL', 'Attachment Deleted'),
	('TASK_STAT_CHNG', 'Task Status Changed'),
	('SIGNATURE_ADD', 'Signature Added'),
	('SIGNATURE_UPD', 'Signature Updated'),
	('SIGNATURE_DEL', 'Signature Deleted'),
)

class TaskLogHistory(models.Model):
	task_log_id = models.AutoField(primary_key=True, verbose_name='Task Log ID')
	project_id = models.CharField(max_length=64, null=True, blank=True)
	task_id = models.CharField(max_length=64, null=True, blank=True)
	task_log_created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
	task_log_created_at = models.DateTimeField(auto_now_add=True)
	task_log_message = models.TextField(null=True, blank=True)
	task_log_status = models.CharField(choices=TASK_LOG_STATUS, max_length=20)

	def __str__(self):
		return str(self.task_log_id)


class SectionTemplateMetadata(models.Model):
	section_temp_meta_id = models.AutoField(primary_key=True)
	section_task_metadata = models.ForeignKey(ProjectField, on_delete=models.CASCADE)
	section_task_id = models.CharField(max_length=100)
	section_temp_meta_position = models.PositiveIntegerField(null=True, blank=True)
	section_temp_meta_choices = ArrayField(models.CharField(max_length=100), null=True, blank=True)
	section_temp_meta_config = JSONField(null=True, blank=True, load_kwargs={'object_pairs_hook': collections.OrderedDict})

	def __str__(self):
		return f"Section Metadata ID: {self.section_temp_meta_id}"


class SectionMetadataValues(models.Model):
	section_meta_val_id = models.AutoField(primary_key=True)
	section_task_metadata = models.ForeignKey(ProjectField, on_delete=models.CASCADE)
	section_metadata_value = models.CharField(max_length=10000, null=True, blank=True)
	section_task_id = models.CharField(max_length=100)
	section_meta_val_position = models.PositiveIntegerField(null=True, blank=True)

	def __str__(self):
		return f"Section Metadata Value ID: {self.section_meta_val_id}"

	def section_metadata_type(self):
		return str(self.section_task_metadata.field_type)

	section_metadata_type.short_description = 'Section Metadata Type'


class MetadataTracking(models.Model):
	section_metadata_value = models.ForeignKey('SectionMetadataValues', on_delete=models.CASCADE, related_name='metadata_history', null=True, blank=True)
	task = models.ForeignKey('Task', on_delete=models.CASCADE, related_name='task_history', null=True, blank=True)
	changed_field = models.CharField(max_length=255)  # Stores which field changed
	old_value = models.TextField(null=True, blank=True)
	new_value = models.TextField(null=True, blank=True)
	changed_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
	changed_at = models.DateTimeField(default=now)

	def __str__(self):
		return f"Change in {self.changed_field} at {self.changed_at}"


class SectionMasterChoice(models.Model):
	master_choice = models.CharField(max_length=1000, unique=True)
	special_char_choice = models.CharField(max_length=100, null=True, blank=True)

	def __str__(self):
		return self.master_choice


class SectionMaster(models.Model):
	section_master_name = models.CharField(max_length=255)
	section_master_metadata_name = models.CharField(max_length=255)
	section_master_choice = models.ManyToManyField(SectionMasterChoice, blank=True)
	section_sub_choice = models.CharField(max_length=255, null=True, blank=True)
	is_sub_choice = models.BooleanField(default=False)
	section_sub_metadata_name = models.CharField(max_length=255, null=True, blank=True)
	is_completed = models.BooleanField(default=False)

	def __str__(self):
		return f"{self.section_master_name} - {self.section_master_metadata_name}"


PROJECT_LOG_STATUS = (
	('PROJECT_ADD', 'Project Added'),
	('PROJECT_UPD', 'Project Updated'),
	('PROJECT_DEL', 'Project Deleted'),
	('PROJECT_COPY', 'Project Copied'),
	('PROJECT_DATE_CHNG', 'Project Date Changed'),
	('PROJECT_ARCH', 'Project Archived'),
	('PROJECT_REST', 'Project Restored'),
	('PROJECT_STAT_CHNG', 'Project Status Changed'),
	('PROJECT_SIGNATURE_ADD', 'Project Signature Added'),
	('PROJECT_SIGNATURE_UPD', 'Project Signature Updated'),
	('PROJECT_SIGNATURE_DEL', 'Project Signature Deleted'),
)


class ProjectLogHistory(models.Model):
	project_log_id = models.AutoField(primary_key=True, verbose_name='Project Log ID')
	project_id = models.CharField(max_length=64, null=True, blank=True)
	project_log_created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
	project_log_created_at = models.DateTimeField(auto_now_add=True)
	project_log_message = models.TextField(null=True, blank=True)
	project_log_status = models.CharField(choices=PROJECT_LOG_STATUS, max_length=30)

	def __str__(self):
		return str(self.project_log_id)