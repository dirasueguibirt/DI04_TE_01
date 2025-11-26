import { Component, OnInit, Renderer2, ElementRef, Input } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { GestionApiService } from 'src/app/services/gestion-api.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit {
 
  /*Necesitamos que nuestra aplicación funcione tanto para tab6 como para tab7
   * En tab6, pasamos estos 5 parámetros mediante parámetros
   * En tab7, solo se pasan 3 parámetros, datosCategorias y nombresCategorias se recibirán desde la API, pero aunque no recibamos valores 
   * como parámetro, se hará uso de estas variables Input(), para que todas nuestras tabs funcionen correctamente.
  */
  //Estas variables se reciben como parámetro desde tab6, pero no desde tab7.
  @Input() datosCategorias: number[] = [];
  @Input() nombresCategorias: string[] = [];

  //Estas variables se reciben como parámetro tanto de tab6 como de tab7
  @Input() backgroundColorCategorias: string[] = [];
  @Input() borderColorCategorias: string[] = [];
  @Input() tipoChartSelected: string = "";
  // Atributo que almacena los datos del chart
  public chart!: Chart;

  constructor(private el: ElementRef, private renderer: Renderer2, private gestionServiceApi: GestionApiService) {}
 
  ngOnInit(): void {
  console.log("Ejecuta bar-chart");

  // Solo suscribirse al servicio si no se reciben datos por input (caso tab7)
  if (this.datosCategorias.length === 0 && this.nombresCategorias.length === 0) {
    this.gestionServiceApi.datos$.subscribe((datos) => {
      if (datos != undefined) {

        // Guardamos los datos en los arrays
        this.nombresCategorias.push(datos.categoria);
        this.datosCategorias.push(datos.totalResults);

        // Si el chart aún no existe, lo inicializamos
        if (!this.chart) {
          this.inicializarChart();
        } else {
          // Actualizamos el chart directamente con los nuevos datos
          this.chart.data.labels = [...this.nombresCategorias];
          this.chart.data.datasets[0].data = [...this.datosCategorias];

          // También actualizamos colores si quieres
          this.chart.data.datasets[0].backgroundColor = this.backgroundColorCategorias.slice(0, this.datosCategorias.length);
          this.chart.data.datasets[0].borderColor = this.borderColorCategorias.slice(0, this.datosCategorias.length);

          this.chart.update();
        }
      }
    });
  } else {
    this.inicializarChart();
  }
}



  private inicializarChart() {

    let data = null;
  
    if (this.tipoChartSelected === "bar-chart"){
      // datos
      data = {
        labels: this.nombresCategorias,
        datasets: [{
          label: 'Noticias',
          data: this.datosCategorias,
          fill: false,
          backgroundColor: this.backgroundColorCategorias,
          borderColor: this.borderColorCategorias,
          tension: 0.1
        }]
      };
    } else {
      // datos
      data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'My First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          tension: 0.1
        }]
      };
    }
    
  
    // Creamos la gráfica
    const canvas = this.renderer.createElement('canvas');
    this.renderer.setAttribute(canvas, 'id', 'barChart');
  
    // Añadimos el canvas al div con id "chartContainer"
    const container = this.el.nativeElement.querySelector('#contenedor-barchart');
    this.renderer.appendChild(container, canvas);

    const datasets = this.nombresCategorias.map((nombre, i) => ({
  label: nombre,                  // cada categoría tiene su propio label
  data: [this.datosCategorias[i]],// un solo valor
  backgroundColor: this.backgroundColorCategorias[i],
  borderColor: this.borderColorCategorias[i],
  borderWidth: 1
}));

this.chart = new Chart(canvas, {
  type: 'bar',
  data: {
    labels: [''],
    datasets: datasets
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true },    // mostrará todas las categorías
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.dataset.data[0]}`
        }
      },
      title: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  }
});


  
    this.chart.canvas.width = 100;
    this.chart.canvas.height = 100;
  }

}