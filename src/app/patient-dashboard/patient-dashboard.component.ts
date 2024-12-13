import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importez HttpClient
import { Console } from 'console';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.scss']
})
export class PatientDashboardComponent implements OnInit {
  specialties: any[] = [];  // Tableau pour stocker les spécialités récupérées
  selectedSpecialty: string = ''; // Spécialité sélectionnée

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Appeler la méthode pour récupérer les spécialités dès le chargement du composant
    this.getSpecialties();
  }

  // Méthode pour récupérer les spécialités depuis l'API
  getSpecialties(): void {
    const apiUrl = 'http://localhost:3600/api/speciality'; // URL de l'API
    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        this.specialties = data;
        console.log(data);
        console.log(this.specialties);
                // Assigner la réponse de l'API à la variable specialties
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des spécialités', error);
      }
    });
  }

  // Méthode pour filtrer les médecins selon la spécialité sélectionnée
  filterDoctorsBySpecialty(): void {
    if (this.selectedSpecialty) {
      // Filtrer la liste des médecins en fonction de la spécialité sélectionnée (si nécessaire)
    }
  }
}
