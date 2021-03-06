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
  generalDonationTransactionTypeId,
  adjustmentTransactionTypeId,
  transferId,
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
  isGeneralDonation: () => transactionTypeId =>
    transactionTypeId === generalDonationTransactionTypeId,
  isAdjustment: () => transactionTypeId =>
    transactionTypeId === adjustmentTransactionTypeId,
  isDeposit: () => transactionTypeId =>
    transactionTypeId === depositTransactionTypeId,
  isTransfer: () => transactionTypeId =>
    transactionTypeId === transferId,
  transaction: state => transactionId => _.find(state.data, { id: transactionId }),
  reportForCategoryType: state => categoryTypeId => state.data
    .filter(item => item.category_type_id === categoryTypeId),
};
