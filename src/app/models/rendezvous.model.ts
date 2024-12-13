// src/app/models/rendezvous.model.ts

export interface Rendezvous {
    id: number;
    doctorId: number;
    patientId: number;
    appointmentDate: string;  // ou Date, selon votre format
    speciality: string;
    details: string;
    status: string;  // Par exemple: "pending", "completed"
  }
  