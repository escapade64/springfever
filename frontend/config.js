// Liste des spots de funboard. Pour ajouter un spot, copier un bloc et l'adapter :
// - id : identifiant unique (pas d'espace/accent), utilisé en interne
// - name : nom affiché, cliquable pour changer de spot
// - lat / lon : coordonnées GPS du spot
// - criteria.min_speed : vitesse de vent minimale, en noeuds
// - criteria.direction_center : direction de vent favorable, en degres (0=N, 90=E, 180=S, 270=O)
// - criteria.tolerance : tolerance autour de direction_center, en degres (+/-)
const SPOTS = [
  {
    id: "corderie",
    name: "La Corderie - Bréhat",
    lat: 48.8531149173526,
    lon: -3.011233363141454,
    criteria: {
      min_speed: 15,
      direction_center: 270,
      tolerance: 30,
    },
  },
  {
    id: "pereire",
    name: "Péreire - Arcachon",
    lat: 44.649916465296805,
    lon: -1.2015675382325726,
    criteria: {
      min_speed: 15,
      direction_center: 250,
      tolerance: 20,
    },
  },
  {
    id: "leucate",
    name: "Leucate",
    lat: 42.89347043459993,
    lon: 3.0153819500589245,
    criteria: {
      min_speed: 15,
      direction_center: 280,
      tolerance: 25,
    },
  },
];

function getSpot(spotId) {
  return SPOTS.find((s) => s.id === spotId) ?? SPOTS[0];
}
