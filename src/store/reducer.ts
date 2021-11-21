import { Action } from './actions';

export interface State {
  amount: {
    usd: number;
    eur: number;
    gbp: number;
  };
}

export const initialState: State = {
  amount: {
    usd: 200,
    eur: 150,
    gbp: 10,
  },
};

export const reducer = (
  state: State = initialState,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case Action.UPDATE_AMOUNT: {
      return { ...state, amount: {...state.amount, ...action.payload} };
    }
    default:
      return state;
  }
};
