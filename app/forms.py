from django.forms import ModelForm, Textarea

from .models import Project, Borehole, Geology, Message


class ProjectForm(ModelForm):
    """
    Form for creating and updating project details.
    """

    class Meta:
        model = Project
        fields = [
            "project_title",
            "project_reference",
            "project_client",
            "project_description"
        ]


class BoreholeForm(ModelForm):
    """
    Form for creating and updating borehole details.
    """

    class Meta:
        model = Borehole
        fields = [
            "borehole_reference",
            "borehole_northing",
            "borehole_easting",
            "ground_level",
            "drilling_equipment",
            "borehole_diameter"
        ]


class GeologyForm(ModelForm):
    """
    Form for creating and updating geology details.
    """

    class Meta:
        model = Geology
        fields = [
            "start_depth",
            "end_depth",
            "sample_number",
            "spt_result",
            "field_test_details",
            "geology_description"
        ]


class MessageForm(ModelForm):
    """
    Form for creating messages.
    """

    class Meta:
        model = Message
        fields = [
            "message"
        ]
