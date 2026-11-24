export interface Order {
  id: string;
  customerId: string;
  total: number;
  /** Endereço de entrega informado no checkout. */
  delivery: string;
  /** Forma de pagamento e resumo dos itens (a API ainda não guarda itens). */
  notes: string;
  /** Data do pedido no formato `YYYY-MM-DD`. */
  date: string;
}

export type NewOrder = Omit<Order, 'id' | 'date'>;
