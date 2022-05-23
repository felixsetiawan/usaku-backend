export interface Transaction {
  id: number;
  uid: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  datetime: Date;
  proof: string;
}
