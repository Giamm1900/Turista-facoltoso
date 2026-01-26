# Diagramma ER

## Entità

### UTENTE

- id (PK)
- nome
- cognome
- email
- indirizzo
- data_registrazione

### HOST (specializzazione di UTENTE)

- id (PK, FK → Utente.id)
- data_inizio_periodo_host

### ABITAZIONE

- id (PK)
- nome
- indirizzo
- numero_locali
- numero_posti_letto
- prezzo_per_notte
- disponibilita_inizio
- disponibilita_fine
- host_id (FK → Host.id)

### PRENOTAZIONE

- id (PK)
- data_inizio
- data_fine
- utente_id (FK → Utente.id)
- abitazione_id (FK → Abitazione.id)

### FEEDBACK

- id (PK)
- titolo
- testo
- punteggio
- prenotazione_id (FK → Prenotazione.id, UNIQUE)
- host_id (FK → Host.id)

### SUPER-HOST (entità derivata / vista, NON tabella fisica)

- host_id
- totale_prenotazioni
- Host con ≥ 100 prenotazioni.

## Relazioni e cardinalità

### Relazione -- Descrizione -- Cardinalità

- Utente → Host -- Specializzazione -- 1 : 0..1
- Host → Abitazione -- Carica. 1 : N
- Utente → Prenotazione -- Effettua -- 1 : N
- Abitazione → Prenotazione -- Riguarda -- 1 : N
- Prenotazione → Feedback -- Può avere -- 1 : 0..1
- Host → Feedback -- Riceve -- 1 : N
- Host → SuperHost -- Derivata -- 1 : 0..1
