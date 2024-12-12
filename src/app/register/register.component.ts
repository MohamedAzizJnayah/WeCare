import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  isLogin: boolean = false; // Par défaut, mode inscription
  role: string = 'doctor'; // Par défaut, rôle 'doctor'
  user: any = {
    username: '',
    password: '',
    role: 'doctor'
  };
  successMessage: string = ''; // Message de succès
  errorMessage: string = '';   // Message d'erreur

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.isLogin) {
      this.login();
    } else {
      this.register();
    }
  }

  register() {
    console.log('Registering user:', this.user);
  
    const checkUrl = `http://localhost:3600/api/medecin/findByEmail/${this.user.username}`; // URL pour vérifier l'existence
    const createUrl = 'http://localhost:3600/api/medecin'; // URL pour créer un nouveau médecin
  
    // Étape 1 : Vérifier si le médecin existe déjà
    this.http.get(checkUrl).subscribe(
      (existingDoctor: any) => {
        if (existingDoctor && Object.keys(existingDoctor).length > 0) {
          // Si le médecin existe, afficher un message d'erreur
          this.successMessage = '';
          this.errorMessage = `Le médecin avec l'email "${this.user.username}" existe déjà.`;
          console.log('Médecin trouvé :', existingDoctor);
        } else {
          // Si l'objet est vide, traiter comme médecin inexistant
          this.createDoctor(createUrl);
        }
      },
      error => {
        if (error.status === 404) {
          // Si le médecin n'existe pas (404), on le crée
          console.log('Médecin introuvable, création d\'un nouveau compte.');
          this.createDoctor(createUrl);
        } else {
          // Si une autre erreur survient, afficher un message d'erreur générique
          this.successMessage = '';
          this.errorMessage = 'Une erreur s\'est produite lors de la vérification. Veuillez réessayer.';
          console.error('Erreur lors de la vérification :', error);
        }
      }
    );
  }
  
  // Méthode pour créer un médecin
  private createDoctor(createUrl: string) {
    const doctor = {
      name: this.user.username,
      email: this.user.username
    };
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    // Étape 2 : Créer le médecin
    this.http.post(createUrl, JSON.stringify(doctor), { headers }).subscribe(
      response => {
        this.successMessage = 'Médecin enregistré avec succès !';
        this.errorMessage = '';
        console.log('Médecin enregistré avec succès :', response);
      },
      createError => {
        this.successMessage = '';
        this.errorMessage = 'Erreur lors de l\'enregistrement. Veuillez réessayer.';
        console.error('Erreur lors de l\'enregistrement du médecin :', createError);
      }
    );
  }
  


  login() {
    console.log('Logging in user:', this.user);

    const url = 'http://localhost:3600/api/medecin';

    this.http.post(url, this.user).subscribe(
      response => {
        this.successMessage = 'Connexion réussie !';
        this.errorMessage = '';
        console.log('User logged in successfully!', response);
      },
      error => {
        this.successMessage = '';
        this.errorMessage = 'Erreur lors de la connexion. Veuillez vérifier vos identifiants.';
        console.error('Error logging in user:', error);
      }
    );
  }

  toggleForm() {
    this.isLogin = !this.isLogin;
    this.user = { username: '', password: '', role: this.role };
    this.successMessage = '';
    this.errorMessage = '';
  }

  changeRole(role: string) {
    this.role = role;
    this.user.role = role;
  }
}
