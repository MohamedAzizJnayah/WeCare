// src/app/models/doctor.model.ts
export class Doctor {
    name: string;
    specialty: string;
    contact: string;
  
    constructor(name: string, specialty: string, contact: string) {
      this.name = name;
      this.specialty = specialty;
      this.contact = contact;
    }
  }
  