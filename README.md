# springfever

Comment choisir l'activité du week-end ?

Visualise les fenêtres météo favorables pour des sorties outdoor (planche à voile, surf, alpinisme...) à partir des prévisions [Open-Meteo](https://open-meteo.com/).

## Lancer en local

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
```

Puis ouvrir http://127.0.0.1:8000

## Structure

- `backend/weather.py` — appel à l'API Open-Meteo
- `backend/criteria.py` — logique go/no-go (vent, direction, luminosité du jour)
- `backend/config.py` — spots et critères par défaut par activité
- `backend/app.py` — API FastAPI (`/api/forecast`) + service du frontend
- `frontend/` — page statique (HTML/CSS/JS) qui affiche les créneaux et permet d'ajuster les critères
