import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importez HttpClient

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.scss']
})
export class PatientDashboardComponent implements OnInit {
  specialties: any[] = []; // Stocke les spécialités
  selectedSpecialty: string = ''; // ID de la spécialité sélectionnée
  doctors: any[] = []; // Stocke les médecins d'une spécialité

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getSpecialties(); // Récupérer les spécialités au démarrage
  }

  // Récupérer les spécialités depuis l'API
  getSpecialties(): void {
    const apiUrl = 'http://localhost:3600/api/speciality'; // URL de l'API
    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        this.specialties = data; // Charger les spécialités
        console.log('Specialties:', data);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des spécialités', error);
      }
    });
  }

  // Récupérer les médecins d'une spécialité
  getDoctorsBySpecialty(): void {
    if (this.selectedSpecialty) {
      const apiUrl = `http://localhost:3600/api/medecin/specialite/${this.selectedSpecialty}`;
      this.http.get<any[]>(apiUrl).subscribe({
        next: (data) => {
          this.doctors = data; // Charger les médecins
          console.log('Doctors:', data);
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des médecins', error);
          this.doctors = []; // Réinitialiser si erreur
        }
      });
    } else {
      this.doctors = []; // Si aucune spécialité n'est sélectionnée
    }
  }
  
}
