import { Component, OnInit } from '@angular/core';
import { GestionApiService } from 'src/app/services/gestion-api.service';
import { IonTitle, IonHeader } from "@ionic/angular/standalone";
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '../components/components-module';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule   ]
})
export class HomePage implements OnInit {

  backgroundColorCat: string[] = ['rgba(255,99,132,0.2)', 'rgba(255,159,64,0.2)', 'rgba(255,205,86,0.2)', 'rgba(75,192,192,0.2)', 'rgba(54,162,235,0.2)', 'rgba(153,102,255,0.2)', 'rgba(201,203,207,0.2)'];
  
  borderColorCat: string[] = ['rgb(255,99,132)', 'rgb(255,159,64)', 'rgb(255,205,86)', 'rgb(75,192,192)', 'rgb(54,162,235)', 'rgb(153,102,255)', 'rgb(201,203,207)'];

  tipoDeChartSeleccionado: string = 'bar-chart';

  constructor(private GestionApiService: GestionApiService) {}

  ngOnInit() {
    this.cargarDatosSiEsBarChart();
  }

  segmentChanged(ev: any) {
    this.tipoDeChartSeleccionado = ev.detail.value;
    this.cargarDatosSiEsBarChart();
  }

  private cargarDatosSiEsBarChart() {
    if (this.tipoDeChartSeleccionado === 'bar-chart') {
      this.GestionApiService.fetchAllCategories(); // ← recarga datos frescos
    }
  }
}