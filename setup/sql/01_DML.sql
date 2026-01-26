INSERT INTO utente (nome_user, cognome, email, indirizzo_user,data_registrazione) VALUES
('Andrea', 'Rossi', 'andrea.rossi@email.com', 'Via Roma 10'),
('Giulia', 'Bianchi', 'giulia.bianchi@email.com', 'Via Milano 22'),
('Marco', 'Verdi', 'marco.verdi@email.com', 'Via Napoli 5'),
('Luciano', 'Neri', 'luciano.neri@email.com', 'Corso Torino 44'),
('Federica', 'Blu', 'federica.blu@email.com', 'Via Firenze 8');

INSERT INTO host (id_utente, data_registrazione_host) VALUES
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

-- Operazioni Richiesta dall'app
--1 Ottenere le abitazioni corrispondenti ad un certo codice host

SELECT * 
FROM abitazione a WHERE id = ?

-- 2 Ottenere l'ultima prenotazione dato un id utente

SELECT * 
FROM prenotazione p
WHERE utente_id = ?
ORDER BY created_at
LIMIT 1

--3 Ottenere l'abitazione più gettonata nell'ultimo mese

SELECT a.*, COUNT(p.id) as num_prenotazioni
FROM public.abitazione a
JOIN public.prenotazione p ON a.id = p.abitazione_id
WHERE p.data_inizio >= CURRENT_DATE - INTERVAL '1 month'
GROUP BY a.id
ORDER BY num_prenotazioni DESC
LIMIT 1;

--4 Ottenere gli host con più prenotazioni nell'ultimo mese

SELECT h.id, u.nome_user, u.cognome, COUNT(p.id) as totale_prenotazioni
FROM public.host h
JOIN public.utente u ON h.id = u.id
JOIN public.abitazione a ON h.id = a.id_host
JOIN public.prenotazione p ON a.id = p.abitazione_id
WHERE p.data_inizio >= CURRENT_DATE - INTERVAL '1 month'
GROUP BY h.id, u.nome_user, u.cognome
ORDER BY totale_prenotazioni DESC;

-- 5 Ottenere tutti i super-host

SELECT u.nome_user, u.cognome, sh.totale_prenotazioni
FROM super_host sh
JOIN public.utente u ON sh.host_id = u.id;

--6 Ottenere i 5 utenti con più giorni prenotati nell'ultimo mese
SELECT 
    u.id, 
    u.nome_user, 
    SUM(p.data_fine - p.data_inizio) AS totale_giorni
FROM public.utente u
JOIN public.prenotazione p ON u.id = p.utente_id
WHERE p.data_inizio >= CURRENT_DATE - INTERVAL '1 month'
GROUP BY u.id
ORDER BY totale_giorni DESC
LIMIT 5;

--7 Ottenere il numero medio di posti letto calcolato
-- in base a tutte le abitazioni caricate dagli host
SELECT AVG(n_posti_letto)::NUMERIC(10,2) AS media_posti_letto
FROM public.abitazione;
