from django.shortcuts import render
from django.db.models import *
from django.db import transaction
from computacion_api.serializers import *
from computacion_api.models import *
from rest_framework.authentication import BasicAuthentication, SessionAuthentication, TokenAuthentication
from rest_framework.generics import CreateAPIView, DestroyAPIView, UpdateAPIView
from rest_framework import permissions
from rest_framework import generics
from rest_framework import status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from django.core import serializers
from django.utils.html import strip_tags
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters
from datetime import datetime
from django.conf import settings
from django.template.loader import render_to_string
import string
import random
import json
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class MateriasAll(generics.CreateAPIView):
    # Esta linea se usa para pedir el token de autenticación de inicio de sesión
    permission_classes = (permissions.IsAuthenticated,)
    
    # Permite obtener todas la lista de mis materias
    def get(self, request, *args, **kwargs):
        materias = Materias.objects.all().order_by("id")
        materias = MateriaSerializer(materias, many=True).data
        # Convertir el campo dias_json en un array
        for materia in materias:
            try:
                materia["dias_json"] = json.loads(materia["dias_json"])
            except (json.JSONDecodeError, TypeError):
                # Si el JSON no es válido, establece la materia_json como un valor vacío
                materia["dias_json"] = {}
        return Response(materias, 200)


class MateriasView(APIView):
    def get(self, request, *args, **kwargs):
        materia_id = self.request.query_params.get('id')
        materia = get_object_or_404(Materias, id=materia_id)
        materia_serialized = MateriaSerializer(materia).data

        # Formatear las horas adecuadamente
        if materia_serialized["hora_inicio"]:
            materia_serialized["hora_inicio"] = materia.hora_inicio.strftime('%H:%M')
        if materia_serialized["hora_final"]:
            materia_serialized["hora_final"] = materia.hora_final.strftime('%H:%M')

        if "dias_json" in materia_serialized:
            materia_serialized["dias_json"] = json.loads(
                materia_serialized["dias_json"])

        return Response(materia_serialized, status=status.HTTP_200_OK)

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        # Obtener el ID del administrador (usuario autenticado)
        # Cambio aquí para obtener el ID del administrador
        try:
            administrador = Administradores.objects.get(user=request.user)
            admin_id = administrador.id
        except Administradores.DoesNotExist:
            admin_id = None

        # Copiar los datos de la solicitud en un diccionario mutable
        mutable_data = request.data.copy()

        # Agregar el ID del administrador al diccionario mutable
        # Cambio aquí para usar el ID del administrador
        mutable_data["admin_id"] = admin_id

        # Crear un serializador con los datos modificados
        serializer = MateriaSerializer(data=mutable_data)

        if serializer.is_valid():
            materia_instance = serializer.save()
            materia_data = serializer.data

            if "dias_json" in materia_data:
                materia_data["dias_json"] = json.dumps(
                    materia_data["dias_json"])

            return Response({"materia_created_id": materia_instance.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MateriasViewEdit(generics.CreateAPIView):
    # permission_classes = (permissions.IsAuthenticated,)
    def put(self, request, *args, **kwargs):
        # Fetch the Materias instance
        materia = get_object_or_404(Materias, id=request.data["id"])

        # Create a copy of the request data
        mutable_data = request.data.copy()

        # Validate and format the hours if provided
        hora_inicio = mutable_data.get("hora_inicio")
        hora_final = mutable_data.get("hora_final")

        if hora_inicio:
            try:
                # Ensure the hour is in the correct format
                datetime.strptime(hora_inicio, '%H:%M')
            except ValueError:
                return Response({"error": "Invalid format for hora_inicio. Expected HH:MM."}, status=status.HTTP_400_BAD_REQUEST)

        if hora_final:
            try:
                datetime.strptime(hora_final, '%H:%M')
            except ValueError:
                return Response({"error": "Invalid format for hora_final. Expected HH:MM."}, status=status.HTTP_400_BAD_REQUEST)

        # Ensure 'dias_json' is serialized as a JSON string if it is provided as an array
        dias_json = mutable_data.get("dias_json")
        if dias_json and isinstance(dias_json, list):
            try:
                mutable_data["dias_json"] = json.dumps(dias_json)
            except (TypeError, ValueError) as e:
                return Response({"error": "Invalid format for dias_json. Expected a valid JSON string or array."}, status=status.HTTP_400_BAD_REQUEST)

        # Deserialize the data and update the instance
        serializer = MateriaSerializer(materia, data=mutable_data)
        if serializer.is_valid():
            materia = serializer.save()

            return Response({"message": "Materia actualizada correctamente"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, *args, **kwargs):
        materia = get_object_or_404(Materias, id=request.GET.get("id"))
        try:
            materia.delete()
            return Response({"details": "Materia eliminada correctamente"}, 200)
        except Exception as e:
            return Response({"details": "Ocurrió un error al eliminar la materia"}, 400)
