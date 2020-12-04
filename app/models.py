from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Standard AbstractUser model from Django.
    Also contains serialize() function for returning Json responses.
    """
    pass

    def __str__(self):
        return f"{self.id}: {self.username}"

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "projects": self.projects.count(),
            "boreholes": self.logger.count()
        }


class Project(models.Model):
    """
    Model contains the details of each project.
    Includes an ImageField for saving sketches.
    Also contains serialize() function for returning Json responses.
    """
    lead = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="projects"
    )
    project_title = models.CharField(max_length=55)
    project_reference = models.CharField(max_length=55)
    project_client = models.CharField(max_length=55)
    project_timestamp = models.DateTimeField(auto_now_add=True)
    project_description = models.TextField(max_length=255)
    sketch = models.ImageField(
        upload_to="project_sketch", null=True, blank=True
    )

    def __str__(self):
        return f"{self.project_reference}: {self.project_title}"

    def serialize(self):
        return {
            "id": self.id,
            "lead": self.lead.username,
            "lead_id": self.lead.id,
            "title": self.project_title,
            "ref": self.project_reference,
            "client": self.project_client,
            "date_created": self.project_timestamp.strftime(
                "%b %d %Y, %I:%M %p"
            ),
            "description": self.project_description,
            "boreholes": self.borehole.count(),
            "messages": self.message.count()
        }


class Borehole(models.Model):
    """
    Model contains the details of each borehole from each project.
    Also contains serialize() function for returning Json responses.
    """
    logger = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="logger"
    )
    project = models.ForeignKey(
        "Project", on_delete=models.CASCADE, related_name="borehole"
    )
    borehole_reference = models.CharField(max_length=55)
    borehole_timestamp = models.DateTimeField(auto_now_add=True)
    borehole_northing = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    borehole_easting = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    ground_level = models.DecimalField(max_digits=5, decimal_places=2)
    drilling_equipment = models.CharField(max_length=55)
    borehole_diameter = models.PositiveSmallIntegerField()

    def __str__(self):
        return f"{self.id} ({self.borehole_reference})"

    def serialize(self):
        return {
            "id": self.id,
            "logger": self.logger.username,
            "logger_id": self.logger.id,
            "project": self.project.project_title,
            "project_ref": self.project.project_reference,
            "project_client": self.project.project_client,
            "ref": self.borehole_reference,
            "date_created": self.borehole_timestamp.strftime(
                "%b %d %Y, %I:%M %p"
            ),
            "northing": self.borehole_northing,
            "easting": self.borehole_easting,
            "ground_level": self.ground_level,
            "equipment": self.drilling_equipment,
            "bh_dia": self.borehole_diameter,
        }


class Geology(models.Model):
    """
    Model contains details of each geology layer from each borehole.
    Also contains serialize() function for returning Json responses.
    """
    borehole = models.ForeignKey(
        "Borehole", on_delete=models.CASCADE, related_name="geology"
    )
    start_depth = models.DecimalField(max_digits=5, decimal_places=2)
    end_depth = models.DecimalField(max_digits=5, decimal_places=2)
    sample_number = models.CharField(max_length=12, null=True, blank=True)
    spt_result = models.CharField(max_length=55, null=True, blank=True)
    field_test_details = models.TextField(max_length=255)
    geology_description = models.TextField(max_length=255)
    geology_timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.id}"

    def serialize(self):
        return {
            "id": self.id,
            "borehole": self.borehole.borehole_reference,
            "borehole_id": self.borehole.id,
            "start_depth": self.start_depth,
            "end_depth": self.end_depth,
            "sample_id": self.sample_number,
            "spt": self.spt_result,
            "field_test": self.field_test_details,
            "description": self.geology_description,
            "timestamp": self.geology_timestamp.strftime("%b %d %Y, %I:%M %p")
        }


class Message(models.Model):
    """
    Model contains details of each message from a project.
    Also contains serialize() function for returning Json responses.
    """
    project = models.ForeignKey(
        "Project", on_delete=models.CASCADE, related_name="message"
    )
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    message = models.TextField(max_length=255)
    message_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment {self.id} on Project {self.project.title}"

    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.username,
            "user_id": self.user.id,
            "project": self.project.id,
            "message": self.message,
            "date": self.message_date.strftime("%b %d %Y, %I:%M %p")
        }
