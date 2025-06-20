import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { FacadeService } from './facade.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

// Configuracion de cabercera para la api
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MateriasService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ){}

  public esquemaMateria() {
    return {
      'nrc': '',
      'name_materia': '',
      'seccion': '',
      'salon': '',
      'programa_educativo': '',
      'hora_inicio': '',
      'hora_final': '',
      'dias_json': []
    }
  }

  //Validación para el formulario
  public validarMateria(data: any, editar: boolean) {
    console.log("Validando materia... ", data);
    let error: any = [];

    // Validar que el NRC sea numérico
    if (!this.validatorService.required(data['nrc'])) {
      error["nrc"] = this.errorService.required;
    } else if (!this.validatorService.numeric(data['nrc'])) {
      error["nrc"] = "El NRC debe ser numerico";
    }

    if (!this.validatorService.required(data['name_materia'])) {
      error["name_materia"] = this.errorService.required;
    }

    // Validar que la sección sea numérica
    if (!this.validatorService.required(data['seccion'])) {
      error["seccion"] = this.errorService.required;
    } else if (!this.validatorService.numeric(data['seccion'])) {
      error["seccion"] = "La seccion debe ser numerica";
    }

    if (!this.validatorService.required(data['salon'])) {
      error["salon"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["programa_educativo"])) {
      error["programa_educativo"] = this.errorService.required;
    }

    // Validar hora inicial
    if (!this.validatorService.required(data['hora_inicio'])) {
      error["hora_inicio"] = this.errorService.required;
    }

    // Validar hora final
    if (!this.validatorService.required(data['hora_final'])) {
      error["hora_final"] = this.errorService.required;
    }

    if (data["dias_json"].length == 0) {
      error["dias_json"] = "Al menos debes elegir una dia";
      //alert("Debes seleccionar un dia para poder registrarte.");
    }
    //Return arreglo
    return error;
  }

  /*Aquí van los servicios HTTP
    Servicio para registrar un nuevo usuario
    El /materias esta en la ruta urls.py de la api
    para pasar como peticion post
  */

  // Método para obtener el token de autenticación
  private getToken(): string {
    return this.facadeService.getSessionToken();
  }

  // Método para crear las opciones de solicitud con el token de autenticación
  private getRequestOptions(): { headers: HttpHeaders } {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return { headers: headers };
  }

  // Método para registrar una materia
  public registrarMaterias(data: any): Observable<any> {
    // Serializar dias_json como un string JSON
    const dataToSend = { ...data, dias_json: JSON.stringify(data.dias_json) };
    const requestOptions = this.getRequestOptions();
    return this.http.post<any>(`${environment.url_api}/materias/`, dataToSend, requestOptions);
  }

  public obtenerListaMaterias(): Observable<any> {
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    return this.http.get<any>(`${environment.url_api}/lista-materias/`, { headers: headers });
  }

  //Obtener un solo usuario dependiendo su ID
  public getMateriaByID(idUser: Number) {
    return this.http.get<any>(`${environment.url_api}/materias/?id=${idUser}`, httpOptions);
  }

  // Servicio para actualizar materia
  public editarMateria(data: any): Observable<any> {
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    return this.http.put<any>(`${environment.url_api}/materias-edit/`, data, { headers: headers });
  }

  // Eliminar Materia
  public eliminarMateria(idUser: number): Observable<any> {
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    return this.http.delete<any>(`${environment.url_api}/materias-edit/?id=${idUser}`, { headers: headers });
  }

}
