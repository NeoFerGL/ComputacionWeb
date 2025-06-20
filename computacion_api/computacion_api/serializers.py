from rest_framework import serializers
from rest_framework.authtoken.models import Token
from computacion_api.models import *

# Configuracion de la tabla de usuarios donde al serializar los datos nos regresa esto
class UserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email')

# Serializador de Administrador
class AdminSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True) #Llave foranea a la tabla de usuarios

    class Meta:
        model = Administradores # Nombre de nuestro modelo
        fields = '__all__' # regresa todo

# Serializador de Alumno
class AlumnoSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Alumnos
        fields = "__all__"

# Serializador de Maestros
class MaestroSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Maestros
        fields = "__all__"

# Serializador de materia
class MateriaSerializer(serializers.ModelSerializer):
    # Pude que aqui deba ponerlo asi ya que el la llave foranea.
    # user = AdminSerializer(read_only=True)
    # user = UserSerializer(read_only=True)
    class Meta:
        model = Materias
        fields = '__all__'

    def validate_hora_inicio(self, value):
        if value:
            return value.strftime('%H:%M')
        return value

    def validate_hora_final(self, value):
        if value:
            return value.strftime('%H:%M')
        return value
