from django.urls import path

from . import views


urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path(
        "projects/<int:project_id>/<int:page_number>",
        views.projects,
        name="projects"
    ),
    path("profile/<int:user_id>", views.profile, name="profile"),
    path("borehole/<int:borehole_id>", views.borehole, name="borehole"),
    path(
        "geology/<int:borehole_id>/<int:strata_id>",
        views.geology,
        name="geology"
    ),
    path("sketch/<int:project_id>", views.sketch, name="sketch"),
    path(
        "message/<int:project_id>/<int:page_number>",
        views.message,
        name="message"
    )
]
