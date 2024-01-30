export interface Order {
	id: string,
    entity: string,
    amount: number,
    amount_paid: number,
    amount_due: number,
    currency: string,
    receipt: string,
    offer_id: string,
    status: string,
    attempts: string,
    notes: Object,
	created_at:number
}
export interface CreateOrder{
	amount: number,
	currency: string,
	receipt: String,
	notes: Object
  }
  export interface CreateRefund{
      amount: number,
      payId: string,
      jobStartTime:number
    }