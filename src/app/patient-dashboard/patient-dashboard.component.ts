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
  showDatePicker: boolean = false; // Contrôle l'affichage du sélecteur de date
  appointmentDate: string = ''; // Date de l'appartement
  appointmentTime: string = ''; // Heure de l'appartement
  selectedDoctor: any = null; // Stocke le docteur sélectionné

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

  // Afficher le sélecteur de date et heure lorsque l'utilisateur clique sur un docteur
  Reserver(doctor: any): void {
    this.selectedDoctor = doctor; // Stocker le docteur sélectionné
    this.showDatePicker = true;  // Afficher le sélecteur de date et heure
  }

  // Envoyer la réservation via une méthode POST
  submitReservation(doctor: any): void {
    if (this.appointmentDate && this.appointmentTime) {
      // Combine la date et l'heure pour obtenir un format complet de date et heure
      const appointmentDateTime = `${this.appointmentDate}T${this.appointmentTime}`;

      // Récupérer l'ID du patient depuis sessionStorage
      const patient = JSON.parse(sessionStorage.getItem('user') || '{}');
      const patientId = patient.id || null;  // Assurez-vous que l'ID est présent dans l'objet

      if (patientId) {
        const appointmentData = {
          "dateRDV": appointmentDateTime,  // Date et heure au format "YYYY-MM-DDTHH:MM:SS"
          "heureRDV": appointmentDateTime, // Heure, dans ce cas c'est la même que la date
          "patient": {
            "id": patientId  // Utiliser l'ID du patient récupéré depuis sessionStorage
          },
          "medecin": {
            "id": doctor.id  // ID du médecin
          }
        };

        console.log(appointmentData);

        // Envoi des données de réservation à l'API
        this.http.post('http://localhost:3600/api/rendezvous', appointmentData).subscribe({
          next: (response) => {
            console.log('Réservation réussie:', response);
            alert('Rendez-vous réservé avec succès');
          },
          error: (error) => {
            console.error('Erreur lors de la réservation:', error);
            alert('Erreur lors de la réservation');
          }
        });
      } else {
        alert('ID du patient non trouvé dans la session');
      }
    } else {
      alert('Veuillez sélectionner une date et une heure');
    }
  }
}
