import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
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
    role: '',
    email: '', // Ajout de l'email
    specialite: '' // Ajout de la spécialité pour le rôle doctor
  };
  successMessage: string = ''; // Message de succès
  errorMessage: string = '';   // Message d'erreur

  constructor(private http: HttpClient, private router: Router) {}

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
    // URL de vérification de l'existence du médecin ou du patient
    const checkUrlDoctor = `http://localhost:3600/api/medecin/findByEmail/${this.user.email}`;
    const checkUrlPatient = `http://localhost:3600/api/patient/patientByEmail/${this.user.email}`;
    const createUrlDoctor = 'http://localhost:3600/api/medecin';
    const createUrlPatient = 'http://localhost:3600/api/patient';

    // Sélectionner l'URL de vérification en fonction du rôle
    const checkUrl = this.user.role === 'doctor' ? checkUrlDoctor : checkUrlPatient;
    const createUrl = this.user.role === 'doctor' ? createUrlDoctor : createUrlPatient;

    // Étape 1 : Vérifier si le médecin ou patient existe déjà
    this.http.get(checkUrl).subscribe(
      (existingUser: any) => {
        if (existingUser && Object.keys(existingUser).length > 0) {
          // Si l'utilisateur existe déjà, afficher un message d'erreur
          this.successMessage = '';
          this.errorMessage = `Le ${this.user.role} avec l'email "${this.user.email}" existe déjà.`;
          console.log(`${this.user.role} trouvé :`, existingUser);
        } else {
          // Si l'objet est vide, traiter comme utilisateur inexistant
          this.createUser(createUrl);
        }
      },
      error => {
        if (error.status === 404) {
          // Si l'utilisateur n'existe pas (404), on le crée
          console.log(`${this.user.role} introuvable, création d'un nouveau compte.`);
          this.createUser(createUrl);
        } else {
          // Si une autre erreur survient, afficher un message d'erreur générique
          this.successMessage = '';
          this.errorMessage = 'Une erreur s\'est produite lors de la vérification. Veuillez réessayer.';
          console.error('Erreur lors de la vérification :', error);
        }
      }
    );
  }

  // Méthode pour créer un utilisateur (médecin ou patient)
  private createUser(createUrl: string) {
    const user = {
      nom: this.user.username,
      email: this.user.email,       // Envoi de l'email
      password: this.user.password,
      specialitie: {
        specialityName: this.user.specialite // Ajout de la spécialité dans un objet imbriqué
      }
    };
    
    console.log("l objet a envoye ",user)

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Étape 2 : Créer l'utilisateur (médecin ou patient)
    this.http.post(createUrl, JSON.stringify(user), { headers }).subscribe(
      response => {
        this.successMessage = `${this.user.role.charAt(0).toUpperCase() + this.user.role.slice(1)} enregistré avec succès !`;
        this.errorMessage = '';
        console.log(`${this.user.role} enregistré avec succès :`, response);
      },
      createError => {
        this.successMessage = '';
        this.errorMessage = 'Erreur lors de l\'enregistrement. Veuillez réessayer.';
        console.error(`Erreur lors de l\'enregistrement du ${this.user.role} :`, createError);
      }
    );
  }

  login() {
    console.log('Logging in user:', this.user);
  
    // URL de vérification de l'existence du médecin ou du patient
    const checkUrlDoctor = `http://localhost:3600/api/medecin/findByEmail/${this.user.email}`;
    const checkUrlPatient = `http://localhost:3600/api/patient/patientByEmail/${this.user.email}`;
  
    // Sélectionner l'URL de vérification en fonction du rôle
    const checkUrl = this.user.role === 'doctor' ? checkUrlDoctor : checkUrlPatient;
  
    // Étape 1 : Vérifier si l'utilisateur (médecin ou patient) existe
    this.http.get(checkUrl).subscribe(
      (existingUser: any) => {
        if (existingUser && Object.keys(existingUser).length > 0) {
          // Si l'utilisateur existe, effectuer la connexion
          console.log(`${this.user.role} trouvé :`, existingUser);
    
          // Créer un objet avec les identifiants de l'utilisateur
          const loginData = {
            email: this.user.email,  // Utilisation de l'email pour la connexion
            password: this.user.password
          };
  
          // URL de connexion en fonction du rôle
          const loginUrl = this.user.role === 'doctor' 
                            ? 'http://localhost:3600/api/medecin/login' 
                            : 'http://localhost:3600/api/patient/login';
  
          // Effectuer la connexion
          this.http.post(loginUrl, loginData).subscribe(
            response => {
              this.successMessage = `${this.user.role.charAt(0).toUpperCase() + this.user.role.slice(1)} connecté avec succès !`;
              this.errorMessage = '';
              console.log(`${this.user.role} connecté avec succès :`, response);
              this.router.navigate(['dashboard']);
            },
            error => {
              this.successMessage = '';
              this.errorMessage = 'Erreur lors de la connexion. Veuillez vérifier vos identifiants.';
              console.error(`Erreur lors de la connexion du ${this.user.role} :`, error);
            }
          );
        } else {
          // Si l'utilisateur n'existe pas, afficher un message d'erreur
          this.successMessage = '';
          this.errorMessage = `Le ${this.user.role} avec l'email "${this.user.email}" n'existe pas.`;
          console.error(`Le ${this.user.role} n'existe pas.`);
        }
      },
      error => {
        this.successMessage = '';
        this.errorMessage = 'Erreur lors de la vérification. Veuillez réessayer.';
        console.error('Erreur lors de la vérification de l\'utilisateur :', error);
      }
    );
  }

  toggleForm() {
    this.isLogin = !this.isLogin;
    this.user = { username: '', password: '', role: this.role, email: '', specialite: '' };
    this.successMessage = '';
    this.errorMessage = '';
  }
}
