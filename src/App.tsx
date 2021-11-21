import React from "react";
import { useEffect } from "react";
import { CurrencyBoard } from "./components/CurrencyBoard";
import { useSelector, useDispatch } from "react-redux";
import { State } from "./store/reducer";
import { updateAmount } from "./store/actions";
import axios from "axios";
import "./assets/css/App.css";

function App() {
  const dispatch = useDispatch();
  const [firstCurrency, setFirstCurrency] = React.useState("eur");
  const [secondCurrency, setSecondCurrency] = React.useState("usd");
  const [firstPrice, setFirstPrice] = React.useState("");
  const [secondPrice, setSecondPrice] = React.useState("");
  const [rate, setRate] = React.useState('');
  const [rates, setRates] = React.useState();
  const [overFlow, setOverFlow] = React.useState(false);
  
  const amount = useSelector<State, State["amount"]>(
    (state) => state.amount
  );

  useEffect(() => {
    axios.get(process.env.REACT_APP_CONVERSION_RATES || '')
      .then((res: any) => {
        setRates(res.data.rates);

        const rateValue = res.data.rates[secondCurrency.toUpperCase()] / res.data.rates[firstCurrency.toUpperCase()];
        setRate(rateValue.toFixed(2));
      });
  }, []);

  const onChangeFirst = (value: string) => {
    setFirstCurrency(value);
    getRateValue(value, secondCurrency)
  };

  const onChangeSecond = (value: string) => {
    setSecondCurrency(value);
    getRateValue(firstCurrency, value)
  };

  const getCurrency = (currency: string) => {
    return currency === 'usd' ? '$' : 
          currency === 'eur' ? '€' : 
          currency === 'gbp' ? '£' : 
          '';
  };

  const getRateValue = (firstValue: string, secondValue: string) => {
    if (typeof(rates) != 'undefined') {
      const rateValue = rates[secondValue.toUpperCase()] / rates[firstValue.toUpperCase()];
      setRate(rateValue.toFixed(2));
    }
  };

  const onChangeFirstPrice = (value: string) => {
    setFirstPrice(value);
    const secondValue = parseFloat(value) * parseFloat(rate);
    setSecondPrice(secondValue.toFixed(2));

    checkOverFlow(value);
  };

  const checkOverFlow = (value: string) => {
    if ((firstCurrency === 'usd' && parseFloat(value) > amount.usd) || (firstCurrency === 'eur' && parseFloat(value) > amount.eur) || (firstCurrency === 'gbp' && parseFloat(value) > amount.gbp)) setOverFlow(true);
    else setOverFlow(false);
  };

  const onChangeSecondPrice = (value: string) => {
    setSecondPrice(value);
    const firstValue = parseFloat(value) / parseFloat(rate);
    setFirstPrice(firstValue.toFixed(2));

    checkOverFlow(firstValue.toFixed(2));
  };

  const onExchange = () => {
    if (!overFlow) {
      setCurrency(firstCurrency, firstPrice, 'minus');
      setCurrency(secondCurrency, secondPrice, 'add');

      setFirstPrice("");
      setSecondPrice("");
    }
  };

  const setCurrency = (currency: string, price: string, action: string) => {
    let newAmount = {};
    
    if (currency === 'usd') {
      const newPrice = action === 'minus' ? amount.usd - parseFloat(price) : amount.usd + parseFloat(price);
      newAmount = { usd: Math.round(newPrice * 100) / 100 };
    }
    else if (currency === 'eur') {
      const newPrice = action === 'minus' ? amount.eur - parseFloat(price) : amount.eur + parseFloat(price);
      newAmount = { eur: Math.round(newPrice * 100) / 100 };
    }
    else if (currency === 'gbp') {
      const newPrice = action === 'minus' ? amount.usd - parseFloat(price) : amount.gbp + parseFloat(price);
      newAmount = { gbp: Math.round(newPrice * 100) / 100 };
    }
    
    dispatch(updateAmount(newAmount));
  };

  return (
    <>
      <div className="container">
        <div className="title">Currency Exchange Prototype</div>
        <div className="currency_wrap">
          <CurrencyBoard onChangeCurrency={onChangeFirst} currency={firstCurrency} onChangePrice={onChangeFirstPrice} price={firstPrice} overflow={overFlow} handle="sender" />
          <div className="rate_board">{getCurrency(firstCurrency)}1 = {getCurrency(secondCurrency)} {rate}</div>
          <CurrencyBoard onChangeCurrency={onChangeSecond} currency={secondCurrency} onChangePrice={onChangeSecondPrice} price={secondPrice} handle="receiver" />
        </div>
        <button className="btn-exchange" onClick={onExchange}>Exchange</button>
      </div>
    </>
  );
}

export default App;
