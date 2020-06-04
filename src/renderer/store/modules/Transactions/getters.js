import {
  loanTransactionTypeIds,
  pikadonTransactionTypeIds,
  pledgeTransactionTypeIds,
  causeTransactionTypeIds,
  debitTransactionTypeIds,
  creditTransactionTypeIds,
  pledgePaymentId,
  startingBalanceTransactionTypeId,
  depositTransactionTypeId,
} from './constants';

export default {
  data: state => state.data,
  getItem: state => id => _.find(state.data, { id }),
  isLoan: () => transactionTypeId => loanTransactionTypeIds.includes(transactionTypeId),
  isPikadon: () => transactionTypeId => pikadonTransactionTypeIds.includes(transactionTypeId),
  isPledge: () => transactionTypeId => pledgeTransactionTypeIds.includes(transactionTypeId),
  isCause: () => transactionTypeId => causeTransactionTypeIds.includes(transactionTypeId),
  isDebit: () => transactionTypeId => debitTransactionTypeIds.includes(transactionTypeId),
  isCredit: () => transactionTypeId => creditTransactionTypeIds.includes(transactionTypeId),
  isPledgePayment: () => transactionTypeId =>
    transactionTypeId === pledgePaymentId,
  isStartingBalance: () => transactionTypeId =>
    transactionTypeId === startingBalanceTransactionTypeId,
  isDeposit: () => transactionTypeId =>
    transactionTypeId === depositTransactionTypeId,
  transaction: state => transactionId => _.find(state.data, { id: transactionId }),
  reportForCategoryType: state => categoryTypeId => state.data
    .filter(item => item.category_type_id === categoryTypeId),
};
