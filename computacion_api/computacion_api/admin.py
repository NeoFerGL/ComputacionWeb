from django.contrib import admin
from computacion_api.models import *

#  Aqui pongo las clases(modelos) de usuarios
admin.site.register(Administradores)
admin.site.register(Alumnos)
admin.site.register(Maestros)
admin.site.register(Materias)