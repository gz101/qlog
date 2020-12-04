import os
import json
import base64
import time

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.core.paginator import Paginator

from .models import User, Project, Borehole, Geology, Message
from .forms import ProjectForm, BoreholeForm, GeologyForm, MessageForm


def index(request):
    """
    Basic function to load the base template when accessing web app.
    """

    # If user not logged in, redirect to login page
    if request.user.is_authenticated:
        return render(request, "app/index.html")
    else:
        return HttpResponseRedirect(reverse("login"))


def projects(request, project_id, page_number=1):
    """
    This function deals with everything to do with project models.
    This function handles the following requests:
        1. GET requests for single specific boreholes
        2. GET requests for all boreholes
        3. POST requests for creating new boreholes
        4. PUT requests for editing current boreholes
    """

    # Check if user is logged in
    if request.user.is_authenticated:

        # If request method is GET
        if request.method == "GET":

            # If project_id == 0, this is a singal that all projects requested
            if project_id == 0:
                projects = Project.objects.order_by(
                    "-project_timestamp").all()

                # Paginator before returning JSON object
                paginator = Paginator(projects, 5)
                page_obj = paginator.get_page(page_number)

                return JsonResponse(data={
                    "projects": [project.serialize() for project in page_obj],
                    "total_pages": paginator.num_pages,
                    "current_page": page_obj.number,
                    "has_prev": page_obj.has_previous(),
                    "has_next": page_obj.has_next()
                    }, safe=False)

            # Single project requested with all borehole information
            else:
                project = Project.objects.filter(id=project_id).first()
                boreholes = project.borehole.order_by(
                    "borehole_timestamp").all()

                # Paginator before returning JSON object
                paginator = Paginator(boreholes, 5)
                page_obj = paginator.get_page(page_number)

                return JsonResponse({
                    "project": project.serialize(),
                    "boreholes": [
                        borehole.serialize() for borehole in page_obj],
                    "total_pages": paginator.num_pages,
                    "current_page": page_obj.number,
                    "has_prev": page_obj.has_previous(),
                    "has_next": page_obj.has_next()
                }, safe=False)

        # Create new project via POST
        elif request.method == "POST":

            # Check if user exists
            try:
                user = User.objects.filter(id=request.user.id).first()
            except User.DoesNotExist:
                return JsonResponse({
                    "error": "User could not be found."
                }, status=400)

            # Obtain information from POST data
            data = json.loads(request.body)

            # Place POST data inside Django form for validation
            form = ProjectForm(data)

            # Check if data is valid
            if form.is_valid():

                # Create new Project
                project = Project(
                    lead=user,
                    project_title=form.cleaned_data["project_title"],
                    project_reference=form.cleaned_data["project_reference"],
                    project_client=form.cleaned_data["project_client"],
                    project_description=form.cleaned_data[
                        "project_description"]
                )
                project.save()

                return JsonResponse({
                    "message": "New project created."
                }, status=201)

            # Inputs are not valid
            else:
                return JsonResponse({"error": "Invalid inputs."}, status=400)

        # Request to edit current project
        elif request.method == "PUT":

            # Check if project exists for editing
            try:
                project = Project.objects.filter(id=project_id).first()
            except Project.DoesNotExist:
                return JsonResponse({
                    "error": "Project could not be found."
                }, status=400)

            # Obtain information from POST data
            data = json.loads(request.body)

            # Place POST data inside Django form for validation
            form = ProjectForm(data)

            # Check if data is valid
            if form.is_valid():

                # Update existing project info before saving
                project.project_title = form.cleaned_data["project_title"]
                project.project_reference = form.cleaned_data[
                    "project_reference"]
                project.project_client = form.cleaned_data["project_client"]
                project.project_description = form.cleaned_data[
                    "project_description"]
                project.save()

                return JsonResponse({
                    "message": "Project updated."
                }, status=201)

            # Inputs are invalid
            else:
                return JsonResponse({"error": "Invalid inputs."}, status=400)

        # Not a GET, POST or PUT response
        else:
            return JsonResponse({"error": "Request not valid."}, status=400)

    # User is not logged in, return error
    else:
        return JsonResponse({"error": "User not logged in."}, status=400)


def profile(request, user_id):
    """
    This function deals with all things about the user profiles.
    Only GET requests are allowed and user will need to be signed in.
    This function can handle requests for all users or a single user.
    """

    # Needs to be a GET request
    if request.method != "GET":
        return JsonResponse({"error": "Request not valid."}, status=400)

    # Checks user is logged in
    if request.user.is_authenticated:

        # If user is == 0, this is a request to list all users
        if user_id == 0:
            users = User.objects.all()
            return JsonResponse(
                [user.serialize() for user in users], safe=False)

        # Request for single user's profile page
        else:
            try:
                user = User.objects.filter(id=user_id).first()
            except User.DoesNotExist:
                return JsonResponse({
                    "error": "User could not be found."
                }, status=400)

            # Get all projects lead by user
            projects_leading = Project.objects.filter(lead=user)
            projects_leading = projects_leading.order_by(
                "-project_timestamp").all()

            # Get all projects with boreholes being logged by user
            boreholes_logging = Borehole.objects.filter(logger=user).all()
            projects_logging = []
            for borehole in boreholes_logging:
                projects_logging.append(borehole.project)

            # Only list each project once even though multiple boreholes
            projects_logging = list(set(projects_logging))
            projects_logging = sorted(
                projects_logging,
                key=lambda instance: instance.project_timestamp,
                reverse=True
            )

            return JsonResponse({
                "user": user.username,
                "projects_leading": [
                    project.serialize() for project in projects_leading],
                "projects_logging": [
                    project.serialize() for project in projects_logging]
            }, safe=False)

    # If user is not logged in, return error
    else:
        return JsonResponse({"error": "User not logged in."}, status=400)


def borehole(request, borehole_id):
    """
    This view handles every request related to boreholes.
    The following requests are handled:
        1. GET requests for single borehole info
        2. POST requests for creating a new borehole
        3. PUT requests for editing current borehole information
    Users will need to be logged in to use this function.
    """

    # Checks if user is logged in
    if request.user.is_authenticated:

        # If get request, return the specific borehole info
        if request.method == "GET":

            # Check if borehole exists and returns data if exists
            try:
                borehole = Borehole.objects.filter(id=borehole_id).first()
            except Borehole.DoesNotExist:
                return JsonResponse({
                    "error": "Borehole could not be found."
                }, status=400)

            return JsonResponse(borehole.serialize())

        # Request to create new borehole
        elif request.method == "POST":

            # Check if user exists
            try:
                user = User.objects.filter(id=request.user.id).first()
            except User.DoesNotExist:
                return JsonResponse({
                    "error": "User could not be found."
                }, status=400)

            # Obtain info from POST request
            data = json.loads(request.body)

            # Check that project exists
            project_id = data.get("projectId", "")
            try:
                project = Project.objects.filter(id=project_id).first()
            except Project.DoesNotExist:
                return JsonResponse({
                    "error": "Project could not be found."
                }, status=400)

            # Remove this entry from post data as not required for form
            data.pop("projectId", None)

            # Load data into Django form for validation
            form = BoreholeForm(data)

            # Checks if inputs are valid
            if form.is_valid():

                # Create new borehole based on new info
                borehole = Borehole(
                    logger=user,
                    project=project,
                    borehole_reference=form.cleaned_data["borehole_reference"],
                    borehole_northing=form.cleaned_data["borehole_northing"],
                    borehole_easting=form.cleaned_data["borehole_easting"],
                    ground_level=form.cleaned_data["ground_level"],
                    drilling_equipment=form.cleaned_data["drilling_equipment"],
                    borehole_diameter=form.cleaned_data["borehole_diameter"]
                )
                borehole.save()

                return JsonResponse({
                    "message": "New borehole created."
                }, status=201)

            # If there are invalid inputs
            else:
                return JsonResponse({"error": "Invalid inputs."}, status=400)

        # Request to update borehole details
        elif request.method == "PUT":

            # Check if borehole exists
            try:
                borehole = Borehole.objects.filter(id=borehole_id).first()
            except Borehole.DoesNotExist:
                return JsonResponse({
                    "error": "Borehole could not be found."
                }, status=400)

            # Obtain info from POST data
            data = json.loads(request.body)

            # Load data into Django form for validation
            form = BoreholeForm(data)

            # Checks if form is valid
            if form.is_valid():

                # Update borehole with new values before saving
                borehole.borehole_reference = form.cleaned_data[
                    "borehole_reference"]
                borehole.borehole_northing = form.cleaned_data[
                    "borehole_northing"]
                borehole.borehole_easting = form.cleaned_data[
                    "borehole_easting"]
                borehole.ground_level = form.cleaned_data["ground_level"]
                borehole.drilling_equipment = form.cleaned_data[
                    "drilling_equipment"]
                borehole.borehole_diameter = form.cleaned_data[
                    "borehole_diameter"]
                borehole.save()

                return JsonResponse({
                    "message": "Borehole updated."
                }, status=201)

            # If inputs are invalid
            else:
                return JsonResponse({"error": "Invalid inputs."}, status=400)

        # If request is not GET, PUT or POST
        else:
            return JsonResponse({"error": "Request not valid."}, status=400)

    # Cannot use this function if user is invalid
    else:
        return JsonResponse({"error": "User not logged in."}, status=400)


def geology(request, borehole_id, strata_id=0):
    """
    This function handles requests to do with geology or layers.
    The following requests are handled:
        1. GET requests for all geology from a borehole
        2. GET requests for a single geology layer
        3. POST requests to create a new geology layer
        4. PUT requests to edit an existing geology layer
    Users will need to be logged in to use this function.
    """

    # Checks if user is logged in
    if request.user.is_authenticated:
        try:
            borehole = Borehole.objects.filter(id=borehole_id).first()
        except Borehole.DoesNotExist:
            return JsonResponse({
                "error": "Borehole could not be found."
            }, status=400)

        # If request method is GET
        if request.method == "GET":

            # Strata id == 0 means request for all geology from borehole
            if strata_id == 0:
                try:
                    geology_all = Geology.objects.filter(borehole=borehole)
                    geology_all = geology_all.order_by(
                        "geology_timestamp").all()
                except Geology.DoesNotExist:
                    return JsonResponse({
                        "error": "Geology could not be found."
                    }, status=400)

                return JsonResponse(
                    [geology.serialize() for geology in geology_all],
                    safe=False
                )

            # Else, single geology is requested
            else:
                try:
                    geology = Geology.objects.filter(id=strata_id).first()
                except Geology.DoesNotExist:
                    return JsonResponse({
                        "error": "Geology could not be found."
                    }, status=400)

                return JsonResponse(geology.serialize())

        # POST request to add new layer
        elif request.method == "POST":

            # Obtain POST info
            data = json.loads(request.body)

            # Load data from post request into Django form for validation
            form = GeologyForm(data)

            # Check if form is valid
            if form.is_valid():

                # Create new layer and save
                geology = Geology(
                    borehole=borehole,
                    start_depth=form.cleaned_data["start_depth"],
                    end_depth=form.cleaned_data["end_depth"],
                    sample_number=form.cleaned_data["sample_number"],
                    spt_result=form.cleaned_data["spt_result"],
                    field_test_details=form.cleaned_data[
                        "field_test_details"],
                    geology_description=form.cleaned_data[
                        "geology_description"]
                )
                geology.save()

                return JsonResponse({
                    "message": "New layer added."
                }, status=201)

            # If inputs are invalid
            else:
                return JsonResponse({"error": "Invalid inputs."})

        # If request is PUT
        elif request.method == "PUT":

            # Check if strata exists
            try:
                geology = Geology.objects.filter(id=strata_id).first()
            except Geology.DoesNotExist:
                return JsonResponse({
                    "error": "Strata could not be found."
                }, status=400)

            # Obtain POST info
            data = json.loads(request.body)

            # Load POST info into Django form for validation
            form = GeologyForm(data)

            # Checks if form is valid
            if form.is_valid():

                # Update strata with new values
                geology.start_depth = form.cleaned_data["start_depth"]
                geology.end_depth = form.cleaned_data["end_depth"]
                geology.sample_number = form.cleaned_data["sample_number"]
                geology.spt_result = form.cleaned_data["spt_result"]
                geology.field_test_details = form.cleaned_data[
                    "field_test_details"]
                geology.geology_description = form.cleaned_data[
                    "geology_description"]
                geology.save()

                return JsonResponse({
                    "message": "Strata updated."
                }, status=201)

            # If inputs are invalid
            else:
                return JsonResponse({"error": "Invalid inputs."})

        # If request is not GET, PUT or POST
        else:
            return JsonResponse({"error": "Request not valid."}, status=400)

    # If user is not logged in
    else:
        return JsonResponse({"error": "User not logged in."}, status=400)


def sketch(request, project_id):
    """
    This function handles requests to do with project sketches.
    The following requests are handled:
        1. POST request to create a new sketches
        2. GET request to obtain previous sketches
    Users will need to be logged in to access this view.
    """

    # Checks if user is logged in
    if request.user.is_authenticated:

        # Check that project exists
        try:
            project = Project.objects.filter(id=project_id).first()
        except Project.DoesNotExist:
            return JsonResponse({
                "error": "Project could not be found."
            }, status=400)

        # Request to create a new sketch
        if request.method == "POST":

            # Obtain POST info
            data = json.loads(request.body)
            image_URI = data.get("dataURI", "")

            # Content will need to be cleaned before Python can convert to png
            header, image_content = image_URI.split(";base64,")
            ext = header.split("/")[-1]

            # Replace the previous sketch (only store 1 sketch per project)
            if project.sketch:
                filename = project.sketch.file.name
                project.sketch = None
                os.remove(filename)

            # New id is needed in order to let React know to refresh component
            unique_id = int(time.time())

            # Convert URI data into a png file
            project_sketch = ContentFile(
                base64.b64decode(image_content),
                name=f"{project_id}_{unique_id}." + ext
            )

            # Save new sketch in model
            project.sketch = project_sketch
            project.save()

            return JsonResponse({"message": "Sketch added."}, status=201)

        # Request method is GET for saved images
        else:

            # Checks if there were any previous sketches
            if project.sketch:
                return JsonResponse({
                    "img": project.sketch.url
                })
            return JsonResponse({"message": "No previous sketches."})

    # User not logged in
    else:
        return JsonResponse({"error": "User not logged in."}, status=400)


def message(request, project_id, page_number=1):
    """
    This function handles requests to do with messages on projects.
    The following requests are handled:
        1. POST requests to create new messages
        2. GET requests to obtain previous messages stored
    Users will need to be logged in to access this view.
    """

    # Checks if user is logged in
    if request.user.is_authenticated:

        # Check that project exists
        try:
            project = Project.objects.filter(id=project_id).first()
        except Project.DoesNotExist:
            return JsonResponse({
                "error": "Project could not be found."
            }, status=400)

        # Request to create new message
        if request.method == "POST":

            # Check if user exists
            try:
                user = User.objects.filter(id=request.user.id).first()
            except User.DoesNotExist:
                return JsonResponse({
                    "error": "User does not exist."
                }, status=400)

            # Obtain message info
            data = json.loads(request.body)

            # Validate data using Django forms
            form = MessageForm(data)

            # Check if inputs are valid
            if form.is_valid():

                # Create new message and save
                message = Message(
                    project=project,
                    user=user,
                    message=form.cleaned_data["message"]
                )
                message.save()

                return JsonResponse({"message": "Message added."}, status=201)

            # Inputs are invalid
            else:
                return JsonResponse({"error": "Invalid inputs."}, status=400)

        # Request is GET
        else:
            messages = Message.objects.filter(project=project)
            messages = messages.order_by("-message_date").all()

            # Paginate response
            paginator = Paginator(messages, 5)
            page_obj = paginator.get_page(page_number)

            return JsonResponse({
                    "messages": [message.serialize() for message in page_obj],
                    "total_pages": paginator.num_pages,
                    "current_page": page_obj.number,
                    "has_prev": page_obj.has_previous(),
                    "has_next": page_obj.has_next()
                }, safe=False)

    # If user is not logged in, return error
    else:
        return JsonResponse({"error": "User not logged in."}, status=400)


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "app/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "app/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "app/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "app/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "app/register.html")
