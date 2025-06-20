import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AdministradorService } from 'src/app/services/administrador.service';
import {ChartType, Color} from 'chart.js';

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit {
  //Variables
  public total_user: any = {};
  // Declara pieChartData como propiedad de la clase
  pieChartData: any; // o puedes definir su tipo específico según tus necesidades
  doughnutChartData : any;
  lineChartData : any;
  barChartData : any;


  totalAdmins: number = 0;
  totalMaestros: number = 0;
  totalAlumnos: number = 0;

  constructor(
    private administradoresServices: AdministradorService
  ) { }

  ngOnInit(): void {
    this.obtenerTotalUsers();
  }

  // Esta funcion me ayuda a obtener los roles de los usuarios
  // para las graficas.
  public obtenerTotalUsers() {
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response) => {
        this.total_user = response;
        console.log("Total usuarios: ", this.total_user);

        // Actualizar los valores de totalAdmins, totalMaestros y totalAlumnos
        this.totalAdmins = this.total_user.admins || 0;
        this.totalMaestros = this.total_user.maestros || 0;
        this.totalAlumnos = this.total_user.alumnos || 0;

        // Actualizar los datos de los graficos
        this.actualizarDatosGraficoCircular();
        this.actualizarDatosGraficoDona();
        this.actualizarDatosGraficoHistograma();
        this.actualizarDatosGraficoBarras();

      }, (error) => {
        alert("No se pudo obtener el total de cada rol de usuarios");
      }
    );
  }

  // Metodo para actualizar los datos del grafico Histograma
  private actualizarDatosGraficoHistograma(){
    this.lineChartData = {
      labels: ["Administradores", "Maestros", "Alumnos"],
      datasets: [
        {
          data: [this.totalAdmins, this.totalMaestros, this.totalAlumnos],
          label: 'Registro de usuarios',
          backgroundColor: [
            '#FCFF44',
            '#F1C8F2',
            '#31E731'
          ]
        }
      ]
    };
  }
  lineChartOption = {
    responsive: false
  }
  lineChartPlugins = [DatalabelsPlugin];


  // Metodo para actualizar los datos del grafico Barras
  private actualizarDatosGraficoBarras(){
    this.barChartData = {
      labels: ["Administradores", "Maestros", "Alumnos"],
      datasets: [
        {
          data: [this.totalAdmins, this.totalMaestros, this.totalAlumnos],
          label: 'Registro de usuarios',
          backgroundColor: [
            '#FCFF44',
            '#F1C8F2',
            '#31E731'
          ]
        }
      ]
    }
  }

  // Declaración de las propiedades
  barChartOption = {
    responsive: false
  }
  barChartPlugins = [DatalabelsPlugin];

  // Método para actualizar los datos del gráfico circular
  private actualizarDatosGraficoCircular() {
    this.pieChartData = {
      labels: ["Administradores", "Maestros", "Alumnos"],
      datasets: [
        {
          data: [this.totalAdmins, this.totalMaestros, this.totalAlumnos],
          label: 'Registro de usuarios',
          backgroundColor: [
            '#FCFF44',
            '#F1C8F2',
            '#31E731'
          ]
        }
      ]
    };
  }

  // Declaración de las propiedades de la circular
  pieChartOption = {
    responsive: false
  }
  pieChartPlugins = [DatalabelsPlugin];

  // Método para actualizar los datos del gráfico dona
  private actualizarDatosGraficoDona() {
    this.doughnutChartData = {
      labels: ["Administradores", "Maestros", "Alumnos"],
      datasets: [
        {
          data: [this.totalAdmins, this.totalMaestros, this.totalAlumnos],
          label: 'Registro de usuarios',
          backgroundColor: [
            '#FCFF44',
            '#F1C8F2',
            '#31E731'
          ]
        }
      ]
    };
  }
  doughnutChartOption = {
    responsive: false
  }
  doughnutChartPlugins = [DatalabelsPlugin];

}