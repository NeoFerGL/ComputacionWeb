import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MateriasService } from 'src/app/services/materias.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';

declare var $: any;

@Component({
  selector: 'app-registro-materias',
  templateUrl: './registro-materias.component.html',
  styleUrls: ['./registro-materias.component.scss']
})
export class RegistroMateriasComponent implements OnInit{
  
  // Estos Input lo puse en el registro-screen.component.html y en el ngOnInit
  @Input() rol: string = "";
  @Input() datos_user: any = {};

  public materia: any = {};
  public editar: boolean = false;
  public errors: any = {};
  public idUser: Number = 0;
  public token: string = "";

  // Check
  public valoresCheckbox: any = [];
  public dias_json: any[] = [];

  // Arreglo estatico para el select
  public programas: any[] = [
    { value: '1', viewValue: 'Ingenieria en Ciencias de la Computacion' },
    { value: '2', viewValue: 'Licenciatura en Ciencias de la Computacion' },
    { value: '3', viewValue: 'Ingenieria en Tecnologias de la Informacion' },
  ];

  public dias: any[] = [
    { value: '1', nombre: 'Lunes' },
    { value: '2', nombre: 'Martes' },
    { value: '3', nombre: 'Miercoles' },
    { value: '4', nombre: 'Jueves' },
    { value: '5', nombre: 'Viernes' },
    { value: '6', nombre: 'Sabado' },
  ];


  constructor(
    private location: Location,
    private materiasService: MateriasService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService
  ){}

  ngOnInit(): void {

    //El primer if valida si existe un parámetro en la URL
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID User: ", this.idUser);
      //Al iniciar la vista asignamos los datos del user
      this.materia = this.datos_user;
    } else {
      this.materia = this.materiasService.esquemaMateria();
      this.materia.rol = this.rol;
      this.token = this.facadeService.getSessionToken();
    }
    //Imprimir datos en consola
    console.log("Materia: ", this.materia);
  }

  public regresar() {
    this.location.back();
  }

  public registrar() {
    
    // Validar
    this.errors = [];

    this.errors = this.materiasService.validarMateria(this.materia, this.editar);
    // Si viene vacío me retorna falso
    if (!$.isEmptyObject(this.errors)) {
      return false;
    }

    // Realizar el registro
    this.materiasService.registrarMaterias(this.materia).subscribe(
      (response) => {
        // Registro exitoso
        console.log("Materia registrada correctamente:", response);
        // Puedes agregar aquí la lógica para redirigir a otra página o mostrar un mensaje de éxito  this.router.navigate(["/"]);
        this.router.navigate(["home"]);
      },
      (error) => {
        // Manejo de errores
        console.error("Error al registrar la materia:", error);
        alert("No se pudo registrar la materia");
        // Puedes agregar aquí la lógica para mostrar un mensaje de error al usuario
      }
    );
  }

  public actualizar(){

    // Validar
    this.errors = [];

    this.errors = this.materiasService.validarMateria(this.materia, this.editar);
    // Si viene vacío me retorna falso
    if (!$.isEmptyObject(this.errors)) {
      return false;
    }

    console.log("Paso la validacion");
    // Invoco a mi servicio de actualizar
    this.materiasService.editarMateria(this.materia).subscribe(
      (response) => {
        // Registro exitoso
        console.log("Materia actualizada correctamente:", response);
        // Puedes agregar aquí la lógica para redirigir a otra página o mostrar un mensaje de éxito  this.router.navigate(["/"]);
        this.router.navigate(["home"]);
      },
      (error) => {
        // Manejo de errores
        console.error("Error al registrar la materia:", error);
        alert("No se pudo registrar la materia");
        // Puedes agregar aquí la lógica para mostrar un mensaje de error al usuario
      }
    );
  }

  public checkboxChange(event: any) {
    //console.log("Evento: ", event);
    if (event.checked) {
      this.materia.dias_json.push(event.source.value)
    } else {
      console.log(event.source.value);
      this.materia.dias_json.forEach((materia, i) => {
        if (materia == event.source.value) {
          this.materia.dias_json.splice(i, 1)
        }
      });
    }
    console.log("Array dias: ", this.materia);
  }

  public revisarSeleccion(nombre: string) {
    if (this.materia.dias_json) {
      var busqueda = this.materia.dias_json.find((element) => element == nombre);
      if (busqueda != undefined) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  //Select
  public changeSelect(event: any) {
    console.log(event.value);
    this.materia.programa_educativo = event.value;
  }

  // Para la hora
  public formatHora(hora: string): string {
    if (!hora) return '';

    // Buscar si la hora contiene 'AM' o 'PM' y extraer la parte anterior
    const [time, modifier] = hora.split(' ');
    let [hours, minutes] = time.split(':');

    if (modifier) {
      if (modifier === 'PM' && hours !== '12') {
        hours = (parseInt(hours, 10) + 12).toString();
      }
      if (modifier === 'AM' && hours === '12') {
        hours = '00';
      }
    }

    const formattedHora = `${hours}:${minutes}`;
    console.log("Hora formateada: ", formattedHora);
    return formattedHora;
  }

  public changeHoraInicio(event: any) {
    const value = event.target.value;
    this.materia.hora_inicio = this.formatHora(value);
    console.log("Hora inicio: ", this.materia.hora_inicio);
  }

  public changeHoraFinal(event: any) {
    const value = event.target.value;
    this.materia.hora_final = this.formatHora(value);
    console.log("Hora final: ", this.materia.hora_final);
  }


}
