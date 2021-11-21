export enum Action {
  UPDATE_AMOUNT = 'UPDATE_AMOUNT',
}

export const updateAmount = (amount: any) => ({
  type: Action.UPDATE_AMOUNT,
  payload: amount,
});
