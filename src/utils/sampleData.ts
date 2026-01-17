import { LineItem } from '../types';

export function generateSampleItems(baseRate: number = 500): LineItem[] {
  return [
    {
      id: '1',
      description: 'Professional Services - Strategic Planning & Consultation',
      quantity: 1,
      rate: baseRate * 0.6,
      vatRate: 20
    },
    {
      id: '2',
      description: 'Implementation Phase 1 - Core system architecture setup, database design, and initial API development',
      quantity: 1,
      rate: baseRate * 0.3,
      vatRate: 20
    },
    {
      id: '3',
      description: 'Hourly Support',
      quantity: 2,
      rate: baseRate * 0.05,
      vatRate: 20
    }
  ];
}
