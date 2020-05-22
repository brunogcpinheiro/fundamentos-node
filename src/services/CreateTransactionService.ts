import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  private hasBalance(outcomeValue: number): boolean {
    const { total } = this.transactionsRepository.getBalance();

    return total <= outcomeValue;
  }

  public execute({ title, type, value }: Request): Transaction {
    if (type === 'outcome' && this.hasBalance(value)) {
      throw Error('No balance to debit this outcome!');
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
