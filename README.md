
# 🎓 Computacion Web

## 🧠 Descripción del Proyecto

**Computacion Web** es una plataforma diseñada para gestionar alumnos, profesores, materias donde los administradores pueden visualizarlos de manera eficiente, gracias a graficas.  
El sistema permite realizar operaciones CRUD sobre cada entidad mediante una API REST desarrollada en **Django**, y una interfaz amigable construida con **Angular** para facilitar la interacción del usuario.  

---

## 🛠️ Tecnologías Empleadas

### Backend
- **Python**
- **Django**
- **MySQL**
- **Postman**

### Frontend
- **Angular 16**
- **TypeScript**
- **HTML**
- **CSS/SCSS**
- **Angular Material**

---

## 🚀 Instalación y Ejecución Local

### 🔧 Backend (Django)

1. Crea y activa un entorno virtual:
   ```bash
   python -m venv computacion_api
   source computacion_api/bin/activate  # En Windows: computacion_api\Scripts\activate
   ```

2. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```

3. Configura la base de datos en `my.cnf` o tu gestor local y aplica migraciones:
   ```bash
   python manage.py makemigrations computacion_api
   python manage.py migrate
   ```

4. Ejecuta el servidor de desarrollo:
   ```bash
   python manage.py runserver
   ```

### 💻 Frontend (Angular)

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Ejecuta el servidor de desarrollo:
   ```bash
   ng serve
   ```

3. Accede a la aplicación:
   ```
   http://localhost:4200
   ```

---

## 📸 Capturas de Pantalla del Sistema Web

### 1. Inicio de sesión  
Pantalla principal para ingresar al sistema.

<img src="https://github.com/user-attachments/assets/fe3251f5-031c-430f-957c-131f37f47a4d" width="400">

---

### 2. Panel de control Admin
Vista para administradores

<img src="https://github.com/user-attachments/assets/f60d9c1b-8adc-401b-85e5-123a282b8734" width="400">

---

### 3. Panel de control Maestros
Vista para maestros

<img src="https://github.com/user-attachments/assets/260ec98a-5e9f-49d6-8288-6246e1bb5887" width="400">

---

### 4. Panel de control Alumnos
Vista para alumnos

<img src="https://github.com/user-attachments/assets/f456e2b4-3ff2-4303-9f70-3bb11a5661fc" width="400">

---

## 🙌 Créditos

Este proyecto fue desarrollado por:

- **Fernando Garza de la Luz**
