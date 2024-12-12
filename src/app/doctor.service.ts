// doctor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from './models/doctor.model';  // Assurez-vous de créer un modèle Doctor

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private apiUrl = 'http://localhost:8080/api/doctors/register';  // L'URL de l'API Spring Boot

  constructor(private http: HttpClient) { }

  registerDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(this.apiUrl, doctor);
  }
}
