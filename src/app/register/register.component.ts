import { Component } from '@angular/core';
import { HttpClient ,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  isLogin: boolean = false; // Par défaut, on est en mode inscription
  role: string = 'doctor'; // Par défaut, on choisit 'doctor'
  user: any = {
    username: '',
    password: '',
    role: 'doctor'
  };

  constructor(private http: HttpClient) {}

  // Méthode pour soumettre le formulaire
  onSubmit() {
    if (this.isLogin) {
      this.login();
    } else {
      this.register();
    }
  }

  // Fonction d'inscription
  

  register() {
    console.log('Registering user:', this.user);
  
    // URL du backend Spring Boot
    const url = 'http://localhost:3600/api/medecin';  // URL du contrôleur Spring Boot
  
    // Créez un objet Medecin basé sur les données du formulaire
    const doctor = {
      
      name: this.user.username,
      // specialty: 'Specialty here',  // Vous pouvez ajouter un champ pour la spécialité dans le formulaire
      // contact: 'Contact here',      // Idem pour le contact
      email: this.user.username ,  // Exemple de génération d'email
    };
  
    // Définir les en-têtes HTTP
    const headers = new HttpHeaders({
      'Content-Type': 'application/json' // En-tête pour spécifier que les données sont au format JSON
    });
  
    // Envoi de la requête HTTP avec les en-têtes et les données en JSON
    this.http.post(url, JSON.stringify(doctor), { headers }).subscribe(
      response => {
        console.log('Medecin registered successfully:', response);
        // Actions après l'enregistrement, comme la redirection ou un message de succès
      },
      error => {
        console.error('Error registering Medecin:', error);
        // Actions en cas d'erreur
      }
    );
  }
  
  

  // Fonction de connexion
  login() {
    console.log('Logging in user:', this.user);

    // Vous pouvez appeler votre API Spring Boot ici pour authentifier l'utilisateur
    const url = 'http://localhost:3600/api/medecin';  // Modifiez l'URL en fonction de votre API

    // Envoi des données au backend (Spring Boot)
    this.http.post(url, this.user).subscribe(response => {
      console.log('User logged in successfully!', response);
      // Ajoutez des actions après la connexion, comme une redirection ou un message de succès
    }, error => {
      console.error('Error logging in user', error);
      // Ajoutez une logique pour afficher une erreur à l'utilisateur
    });
  }

  // Permet de basculer entre le formulaire de login et celui d'inscription
  toggleForm() {
    this.isLogin = !this.isLogin;
    this.user = { username: '', password: '', role: this.role };  // Reset user fields when switching forms
  }

  // Méthode pour changer de rôle entre 'doctor' et 'patient'
  changeRole(role: string) {
    this.role = role;
    this.user.role = role;  // Met à jour le rôle de l'utilisateur
  }
}
