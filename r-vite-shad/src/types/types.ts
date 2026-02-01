
export interface Utente {
  id: number;
  nome_user: string;
  cognome: string;
  email: string;
  indirizzo_user: string;
  data_registrazione: string; // ISO string (timestamp)
}

export interface Host {
  id: number;
  id_utente: number;
  data_registrazione_host: string; // ISO string
}

export interface Abitazione {
  id: number;
  nome_abitazione: string;
  indirizzo_abitazione: string;
  n_locali: number;
  n_posti_letto: number;
  prezzo_per_notte: number;
  disponibilita_inizio: string; // ISO date (YYYY-MM-DD)
  disponibilita_fine: string;   // ISO date (YYYY-MM-DD)
  id_host: number;
}

export interface Prenotazione {
  id: number;
  utente_id: number;
  data_inizio: string; // ISO date
  data_fine: string;   // ISO date
  abitazione_id: number;
  created_at: string;  // ISO timestamp
}

export interface Feedback {
  id: number;
  id_host: number;
  titolo: string;
  testo: string;
  punteggio: number; // 1–5
  prenotazione_id: number;
  data_publicazione: string; // ISO timestamp
}

export interface SuperHost {
  host_id: number;
  totale_prenotazioni: number;
}
