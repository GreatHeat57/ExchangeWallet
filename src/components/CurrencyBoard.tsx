import React, { useEffect } from "react";
import { State } from "../store/reducer";
import { useSelector } from "react-redux";
import "../assets/css/CurrencyBoard.css";

interface CurrencyBoardProps {
  onChangeCurrency(note: string): void;
  currency: string;
  onChangePrice(note: string): void;
  price: string;
  overflow?: boolean;
  handle: string;
}

export const CurrencyBoard: React.FC<CurrencyBoardProps> = ({ onChangeCurrency, currency, onChangePrice, price, overflow, handle }) => {
  const [currencyValue, setCurrencyValue] = React.useState(currency);
  const [priceValue, setPriceValue] = React.useState(price);

  const amount = useSelector<State, State["amount"]>(
    (state) => state.amount
  );

  useEffect(() => {
    setPriceValue(price);
  }, [price]);

  const onChangeCurrencyValue = (value: string) => {
    setCurrencyValue(value);
    onChangeCurrency(value);
  };

  const onChangePriceValue = (value: string) => {
    setPriceValue(value);
    onChangePrice(value);
  };

  return (
    <div className="currency-board">
      <div className="select-currency">
        <select value={currency} onChange={e => onChangeCurrencyValue(e.target.value)}>
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="gbp">GBP</option>
        </select>
        <div className="balance">Balance: 
          <span>
            {
              currencyValue === 'usd' ? ' $' + amount.usd :
              currencyValue === 'eur' ? ' €' + amount.eur :
              currencyValue === 'gbp' ? ' £' + amount.gbp :
              ''
            }
          </span>
        </div>
      </div>
      <div>
        <div className="amount-wrap">
          <div className="symbol">{handle === "sender" ? "-" : "+"}</div>
          <input className="amount" type="number" value={priceValue} onChange={e => onChangePriceValue(e.target.value)} />
        </div>
        {overflow && <div className="exceeds">Exceeds balance</div>}
      </div>
    </div>
  );
};
