import { Scenario } from '../types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'caffetteria',
    title: 'Al Bar Italiano',
    subtitle: 'Pedir un café y cornetto en una cafetería local',
    icon: 'Coffee',
    difficulty: 'Principiante',
    category: 'Vida Cotidiana',
    promptContext: 'Eres un barista amable en una cafetería en Roma. Saluda al cliente en italiano y toma su pedido.',
    goals: [
      { id: 'g1', title: 'Saludar al barista', description: 'Usa "Buongiorno" o "Ciao"' },
      { id: 'g2', title: 'Pedir un café', description: 'Pide "Un espresso per favore"' },
      { id: 'g3', title: 'Pagar la cuenta', description: 'Pregunta "Quanto costa?"' }
    ]
  },
  {
    id: 'ristorante',
    title: 'Cena al Ristorante',
    subtitle: 'Reservar mesa y ordenar comida típica',
    icon: 'Utensils',
    difficulty: 'Principiante',
    category: 'Gastronomía',
    promptContext: 'Eres un camarero en una trattoria tradicional en Florencia. Atiende al cliente.',
    goals: [
      { id: 'r1', title: 'Pedir mesa para dos', description: 'Usa "Un tavolo per due, per favore"' },
      { id: 'r2', title: 'Pedir el menú', description: 'Pide "Il menu, per favore"' },
      { id: 'r3', title: 'Ordenar plato principal', description: 'Selecciona una pasta o pizza' }
    ]
  },
  {
    id: 'stazione',
    title: 'In Stazione',
    subtitle: 'Comprar boletos de tren y consultar horarios',
    icon: 'Train',
    difficulty: 'Intermedio',
    category: 'Viajes',
    promptContext: 'Trabajas en la taquilla de la estación de trenes Roma Termini. Atiende al pasajero.',
    goals: [
      { id: 't1', title: 'Pedir billete de ida', description: 'Pide "Un biglietto solo andata per..."' },
      { id: 't2', title: 'Preguntar andén', description: 'Consulta "Da quale binario parte?"' }
    ]
  }
];
