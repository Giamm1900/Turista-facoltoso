INSERT INTO utente (nome_user, cognome, email, indirizzo_user) VALUES
('Andrea', 'Rossi', 'andrea.rossi@email.com', 'Via Roma 10'),
('Giulia', 'Bianchi', 'giulia.bianchi@email.com', 'Via Milano 22'),
('Marco', 'Verdi', 'marco.verdi@email.com', 'Via Napoli 5'),
('Luciano', 'Neri', 'luciano.neri@email.com', 'Corso Torino 44'),
('Federica', 'Blu', 'federica.blu@email.com', 'Via Firenze 8');

INSERT INTO host (id, data_di_registrazione) VALUES
(1, '2024-01-15 10:30:00'),
(3, '2023-11-20 14:00:00');

INSERT INTO abitazione (
    nome_abitazione, indirizzo_abitazione, n_locali, n_posti_letto,
    prezzo_per_notte, disponibilita_inizio, disponibilita_fine, id_host
) VALUES
('Casa Centro', 'Via Roma 12', 3, 4, 85.50, '2025-01-01', '2025-12-31', 1),
('Appartamento Mare', 'Via Lungomare 7', 2, 3, 110.00, '2025-03-01', '2025-09-30', 3),
('Loft Moderno', 'Via Design 5', 1, 2, 95.00, '2025-02-01', '2025-11-30', 1);

INSERT INTO prenotazione (data_inizio, data_fine, utente_id, abitazione_id) VALUES
('2025-04-10', '2025-04-15', 2, 1),
('2025-06-05', '2025-06-12', 4, 2),
('2025-08-01', '2025-08-07', 5, 3);

INSERT INTO feedback (titolo, testo, punteggio, prenotazione_id, id_host) VALUES
('Ottimo soggiorno', 'Casa pulita e host gentilissimo.', 5, 1, 1),
('Vista splendida', 'Appartamento perfetto per le vacanze.', 4, 2, 3);

SELECT * FROM utente;
SELECT * FROM host;
SELECT * FROM abitazione;
SELECT * FROM prenotazione;
SELECT * FROM feedback;
