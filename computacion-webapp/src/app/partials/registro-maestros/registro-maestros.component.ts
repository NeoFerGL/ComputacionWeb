import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MaestrosService } from 'src/app/services/maestros.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';


// Usamos jason
declare var $: any;

@Component({
  selector: 'app-registro-maestros',
  templateUrl: './registro-maestros.component.html',
  styleUrls: ['./registro-maestros.component.scss']
})
export class RegistroMaestrosComponent implements OnInit {

  @Input() rol: string = "";
  @Input() datos_user: any = {};

  // creo mi jason para maestro
  public maestro: any = {};
  public token: string = "";
  public errors: any = {};
  public editar: boolean = false;
  public idUser: Number = 0;

  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  // password porque es el input del ojo
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  //Check
  public valoresCheckbox: any = [];
  public materias_json: any[] = [];

  // Arreglo estatico para el select
  public areas: any[] = [
    { value: '1', viewValue: 'Desarrollo Web' },
    { value: '2', viewValue: 'Programacion' },
    { value: '3', viewValue: 'Bases de datos' },
    { value: '4', viewValue: 'Redes' },
    { value: '5', viewValue: 'Matematicas' },
  ];
  // Arreglo estatico jason
  public materias: any[] = [
    { value: '1', nombre: 'Aplicaciones Web' },
    { value: '2', nombre: 'Programacion 1' },
    { value: '3', nombre: 'Bases de datos' },
    { value: '4', nombre: 'Tecnologias Web' },
    { value: '5', nombre: 'Mineria de datos' },
    { value: '6', nombre: 'Desarrollo movil' },
    { value: '7', nombre: 'Estructuras de datos' },
    { value: '8', nombre: 'Administracion de redes' },
    { value: '9', nombre: 'Ingenieria de Software' },
    { value: '10', nombre: 'Administracion de S.O.' },
  ];
  constructor(
    private location: Location,
    private maestrosService: MaestrosService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService
  ) {

  }
  // asigno mi esquema del jason al objeto para poder usar las varibales.
  ngOnInit() {
    //El primer if valida si existe un parámetro en la URL
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID User: ", this.idUser);
      //Al iniciar la vista asignamos los datos del user
      this.maestro = this.datos_user;
    } else {
      this.maestro = this.maestrosService.esquemaMaestro();
      this.maestro.rol = this.rol;
      this.token = this.facadeService.getSessionToken();
    }
    //Imprimir datos en consola
    console.log("Maestro: ", this.maestro);
  }

  public regresar() {
    this.location.back();
  }

  public registrar() {
    //Validar
    // Inicializo el jason en un arreglo vacio.
    this.errors = [];

    // Inyecto el servicio desde constructor
    // validarMaestro que voy a validar el jason this.admin
    // y mi bandera para editar
    this.errors = this.maestrosService.validarMaestro(this.maestro, this.editar);
    if (!$.isEmptyObject(this.errors)) {
      return false;
    }

    // TODO: falta registrar (hecho)
    // Validamos que las contrasenias coincidan
    // Validar la contrasenia
    // response si trae datos y mandame al login
    if (this.maestro.password == this.maestro.confirmar_password) {
      this.maestrosService.registrarMaestros(this.maestro).subscribe(
        (response) => {
          alert("Usuario registrado correctamente");
          console.log("Usuario registrado: ", response);
          this.router.navigate(["/"]);
        }, (error) => {
          alert("No se pudo registrar usuario");
        }
      )
      
    } else {
      // Limpio los campos los pongo en blanco
      alert("Las contraseñas no coinciden");
      this.maestro.password = "";
      this.maestro.confirmar_password = "";
    }

  }

  //Funciones para password
  showPassword() {
    if (this.inputType_1 == 'password') {
      this.inputType_1 = 'text';
      this.hide_1 = true;
    }
    else {
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  showPwdConfirmar() {
    if (this.inputType_2 == 'password') {
      this.inputType_2 = 'text';
      this.hide_2 = true;
    }
    else {
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  //Función para detectar el cambio de fecha
  public changeFecha(event: any) {
    console.log(event);
    console.log(event.value.toISOString());

    this.maestro.fecha_nacimiento = event.value.toISOString().split("T")[0];
    console.log("Fecha: ", this.maestro.fecha_nacimiento);
  }

  public actualizar() {
    //Validación
    this.errors = [];

    this.errors = this.maestrosService.validarMaestro(this.maestro, this.editar);
    if (!$.isEmptyObject(this.errors)) {
      return false;
    }
    console.log("Pasó la validación");

    this.maestrosService.editarMaestro(this.maestro).subscribe(
      (response) => {
        alert("Maestro editado correctamente");
        console.log("Maestro editado: ", response);
        //Si se editó, entonces mandar al home
        this.router.navigate(["home"]);
      }, (error) => {
        alert("No se pudo editar el maestro");
      }
    );
  }

  public checkboxChange(event: any) {
    console.log("Evento: ", event);
    if (event.checked) {
      this.maestro.materias_json.push(event.source.value)
    } else {
      console.log(event.source.value);
      this.maestro.materias_json.forEach((materia, i) => {
        if (materia == event.source.value) {
          // Splice recorre el arreglo de uno en uno
          this.maestro.materias_json.splice(i, 1);
        }
      });
    }
    console.log("Array materias: ", this.maestro);
  }

  public changeSelect(event: any) {
    console.log(event.value);
    this.maestro.area_investigacion = event.value;
  }
  

  public revisarSeleccion(nombre: string) {
    if (this.maestro.materias_json) {
      var busqueda = this.maestro.materias_json.find((element) => element == nombre);
      if (busqueda != undefined) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
