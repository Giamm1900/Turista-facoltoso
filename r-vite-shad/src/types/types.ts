
export interface Utente {
  id: number;
  nomeUser: string;
  cognome: string;
  email: string;
  indirizzoUser: string;
  dataRegistrazione: string; // ISO string (timestamp)
}

export interface Host {
  id: number;
  cognome:string
  idUtente: number;
  dataRegistrazione:string
  email:string
  indirizzoUser:string
  nomeUser:string
}

export interface Abitazione {
  id: number;
  nomeAbitazione: string;
  indirizzoAbitazione: string;
  nlocali: number;
  npostiLetto: number;
  prezzoPerNotte: number;
  disponibilitaInizio: string; // ISO date (YYYY-MM-DD)
  disponibilitaFine: string;   // ISO date (YYYY-MM-DD)
  idHost: number;
}

export interface Prenotazione {
  id: number;
  utenteId: number;
  dataInizio: string; // ISO date
  dataFine: string;   // ISO date
  abitazioneId: number;
  createdAt: string;  // ISO timestamp
}

export interface Feedback {
  id: number;
  idUser: number;
  idAbitazione: number;
  titolo: string;
  testo: string;
  punteggio: number; // 1–5
  prenotazioneId: number;
  dataPublicazione: string; // ISO timestamp
}

export interface SuperHost {
  hostId: number;
  totalePrenotazioni: number;
}

