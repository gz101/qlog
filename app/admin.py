from django.contrib import admin

from .models import User, Project, Borehole, Geology, Message


class GeologyInLine(admin.TabularInline):
    """
    Allows adding geology layers while in borehole page.
    Only 1 new geology layer can be added at a time.
    """
    model = Geology
    extra = 1


class BoreholeAdmin(admin.ModelAdmin):
    """
    More intuitive to allow adding geology while on borehole admin page.
    """
    inlines = [GeologyInLine]


admin.site.register(User)
admin.site.register(Project)
admin.site.register(Borehole, BoreholeAdmin)
admin.site.register(Geology)
admin.site.register(Message)
