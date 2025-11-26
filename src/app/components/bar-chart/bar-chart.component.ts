import { GestionApiService } from 'src/app/services/gestion-api.service';
// src/app/components/bar-chart/bar-chart.component.ts
import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bar-chart',
  template: `<canvas #barCanvas></canvas>`,
  styles: [':host { display: block; height: 400px; }']
})
export class BarChartComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() backgroundColorCategorias!: string[];
  @Input() borderColorCategorias!: string[];

  @ViewChild('barCanvas') canvas!: ElementRef<HTMLCanvasElement>;

  apiData: { categoria: string; totalResults: number }[] = [];
  private chart!: Chart;
  private sub!: Subscription;

  constructor(private GestionApiService: GestionApiService) {}

  ngOnInit() {
    this.sub = this.GestionApiService.apiData$.subscribe(data => {
      this.apiData = data;
      if (this.chart) this.actualizarChart();
    });
  }

  ngAfterViewInit() {
    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'bar',
      data: { labels: [], datasets: [] },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  actualizarChart() {
    const datasetsByCat: any = {};

    this.apiData.forEach((item, index) => {
      const cat = item.categoria;
      if (!datasetsByCat[cat]) {
        datasetsByCat[cat] = {
          label: cat.charAt(0).toUpperCase() + cat.slice(1),
          data: new Array(this.apiData.length).fill(0),
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1
        };
      }
      datasetsByCat[cat].data[index] = item.totalResults;
      datasetsByCat[cat].backgroundColor[index] = this.backgroundColorCategorias[index];
      datasetsByCat[cat].borderColor[index] = this.borderColorCategorias[index];
    });

    this.chart.data.labels = this.apiData.map(d => d.categoria);
    this.chart.data.datasets = Object.values(datasetsByCat);
    this.chart.update();

    this.chart.data.labels = this.apiData.map(d => d.categoria);
    this.chart.data.datasets = Object.values(datasetsByCat);

    // ← SOLUCIÓN MÁGICA (4 líneas)
    this.chart.data.datasets.forEach((dataset: any, index: number) => {
      dataset.backgroundColor = this.backgroundColorCategorias[index];
      dataset.borderColor = this.borderColorCategorias[index];
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}