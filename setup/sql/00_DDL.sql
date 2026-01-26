
CREATE TABLE public.utente
(
    id serial PRIMARY KEY NOT NULL,
    nome_user varchar(50) NOT NULL,
    cognome varchar(50) NOT NULL,
    email varchar(100) NOT NULL UNIQUE,
    indirizzo_user varchar(50) NOT NULL,
    data_registrazione CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT name_user_min_length CHECK (LENGTH(nome_user)>=2),
    CONSTRAINT email_format CHECK (email like '%@%.%')
);

CREATE TABLE public.host (
    id SERIAL PRIMARY KEY,
    id_utente INTEGER NOT NULL UNIQUE,
    data_registrazione_host CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_host_utente
        FOREIGN KEY (id_utente)
        REFERENCES utente(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE public.abitazione (
    id SERIAL PRIMARY KEY,
    nome_abitazione VARCHAR(100) NOT NULL,
    indirizzo_abitazione VARCHAR(50) NOT NULL,
    n_locali INTEGER NOT NULL CHECK (n_locali > 0),
    n_posti_letto INTEGER NOT NULL CHECK (n_posti_letto > 0),
    prezzo_per_notte NUMERIC(8,2) NOT NULL CHECK (prezzo_per_notte > 0),
    disponibilita_inizio DATE NOT NULL,
    disponibilita_fine DATE NOT NULL,
    id_host INTEGER NOT NULL,
    CONSTRAINT fk_abitazione_host
        FOREIGN KEY (id_host)
        REFERENCES host(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT chk_date_disponibilita CHECK (disponibilita_fine > disponibilita_inizio)
);

CREATE TABLE public.prenotazione (
    id SERIAL PRIMARY KEY,
    utente_id INTEGER NOT NULL,
    data_inizio DATE NOT NULL,
    data_fine DATE NOT NULL,
    abitazione_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_prenotazione_utente
        FOREIGN KEY (utente_id)
        REFERENCES utente(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_prenotazione_abitazione
        FOREIGN KEY (abitazione_id)
        REFERENCES abitazione(id)
        ON DELETE CASCADE,
    CONSTRAINT chk_date_prenotazione
        CHECK (data_fine > data_inizio)
);

CREATE TABLE public.feedback (
    id SERIAL PRIMARY KEY,
    id_host INTEGER NOT NULL,
    titolo VARCHAR(150) NOT NULL,
    testo TEXT NOT NULL,
    punteggio INTEGER NOT NULL CHECK (punteggio BETWEEN 1 AND 5),
    prenotazione_id INTEGER NOT NULL UNIQUE,
    CONSTRAINT fk_feedback_prenotazione
        FOREIGN KEY (prenotazione_id)
        REFERENCES prenotazione(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_feedback_host
        FOREIGN KEY (id_host)
        REFERENCES host(id)
        ON DELETE CASCADE
);


CREATE VIEW super_host AS
SELECT 
    h.id AS host_id,
    COUNT(p.id) AS totale_prenotazioni
FROM host h
JOIN abitazione a ON a.id_host = h.id
JOIN prenotazione p ON p.abitazione_id = a.id
GROUP BY h.id
HAVING COUNT(p.id) >= 100;


