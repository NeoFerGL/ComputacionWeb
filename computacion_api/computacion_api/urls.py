"""point_experts_api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from computacion_api.views import bootstrap

# Vista de administrador
from computacion_api.views import users
# Vista de alumnos
from computacion_api.views import alumnos
# Vista de maestros
from computacion_api.views import maestros
# Vista para materias
from computacion_api.views import materias

from computacion_api.views import auth

urlpatterns = [
    # Version
    path('bootstrap/version', bootstrap.VersionView.as_view()),
    
    # Create admin ponerlo igual en postman
    path('admin/', users.AdminView.as_view()),
    # Admin data
    path('lista-admins/', users.AdminAll.as_view()),
    # Edit Admin
    path('admins-edit/', users.AdminsViewEdit.as_view()),

    # Create alumno ponerlo igual en postman
    path('alumnos/', alumnos.AlumnosView.as_view()),
    # Alumno Data
    path('lista-alumnos/', alumnos.AlumnosAll.as_view()),
    # Edit Alumno
    path('alumnos-edit/', alumnos.AlumnosViewEdit.as_view()),

    # Creo maestros se pone igual en postman
    path('maestros/', maestros.MaestrosView.as_view()),
    # Maestro Data
    path('lista-maestros/', maestros.MaestrosAll.as_view()),
    # Edit Maestro
    path('maestros-edit/', maestros.MaestrosViewEdit.as_view()),
    
    # Creo materias
    path('materias/', materias.MateriasView.as_view()),
    # Trae la lista de materias
    path('lista-materias/', materias.MateriasAll.as_view()),
    # Edita la materia y/o elimina
    path('materias-edit/', materias.MateriasViewEdit.as_view()),

    # Login
    path('token/', auth.CustomAuthToken.as_view()),
    # Logout cerrar sesion
    path('logout/', auth.Logout.as_view())
]
