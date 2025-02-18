import React, { FC, useEffect, useState, Fragment } from 'react';
import s from './SelectTokenView.module.css';
import cn from 'clsx';
import { useForm } from 'react-hook-form';
import { TfiClose } from 'react-icons/tfi';
import { MODAL_VIEWS_PROPS, ORIGINS, useUI } from '../../ui/context';
import { Input } from '@components/ui';
import { BiSearch } from 'react-icons/bi';
import { useSwapToken } from '@components/swap/context';
import tokenList from '../../../config/token-list';
import { AiOutlineCheck } from 'react-icons/ai';
import { RiEditBoxLine } from 'react-icons/ri';

const tag: FC<{ symbol: string; origin: ORIGINS }> = ({ symbol, origin }) => {
  const { setFromToken, setIntoToken, fromToken, intoToken } = useSwapToken();
  const { closeModal } = useUI();

  const selected = origin === 'from' ? symbol === fromToken.symbol : symbol === intoToken.symbol;

  const handleSelect = () => {
    origin === 'from' ? setFromToken(symbol) : setIntoToken(symbol);
    closeModal();
  };

  return (
    <Fragment key={symbol}>
      <li
        onClick={handleSelect}
        className={cn(s.tag, {
          [s.selected]: selected,
        })}
      >
        <div>{symbol}</div>
      </li>
    </Fragment>
  );
};

const item: FC<{ symbol: string; origin: ORIGINS }> = ({ symbol, origin }) => {
  const { setFromToken, setIntoToken, fromToken, intoToken } = useSwapToken();
  const { closeModal } = useUI();

  const selected = origin === 'from' ? symbol === fromToken.symbol : symbol === intoToken.symbol;

  const handleSelect = () => {
    origin === 'from' ? setFromToken(symbol) : setIntoToken(symbol);
    closeModal();
  };

  return (
    <Fragment key={symbol}>
      <li
        onClick={handleSelect}
        className={cn(s.item, {
          [s.selected]: selected,
        })}
      >
        <div className={s.item__inner}>
          {symbol}
          {selected && <AiOutlineCheck className={s.icon} />}
        </div>
      </li>
    </Fragment>
  );
};

const SelectTokenView: FC<MODAL_VIEWS_PROPS> = ({ origin }) => {
  const {
    control,
    setFocus,
    watch,
    formState: { isDirty },
  } = useForm<{ search: string }>({
    defaultValues: { search: '' },
  });

  const { closeModal } = useUI();
  const { history } = useSwapToken();
  const { search } = watch();
  const [results, setResults] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const results = Object.keys(tokenList).filter((symbol) => symbol.indexOf(search) > -1);
    setResults(results);
  }, [search]);

  useEffect(() => {
    setShowResults(isDirty);
  }, [isDirty]);

  useEffect(() => {
    setFocus('search');
  }, []);

  return (
    <div className={s.root}>
      <div className={s.header}>
        <h3>토큰 선택</h3>
        <button type="button" className={s.action} onClick={closeModal}>
          <TfiClose />
        </button>
      </div>
      <div className={s.container}>
        <div className={s.search}>
          <BiSearch className={s.icon} />
          <Input name={'search'} control={control} className={s.input} placeholder="이름 검색 또는 주소 넣기" />
        </div>
        <div className={s.section}>
          <ul className={s.tags}>{history.slice(0, 7).map((symbol) => tag({ symbol, origin }))}</ul>
        </div>
        <div className={s.section}>
          <ul className={s.items}>
            {showResults
              ? results.map((symbol) => item({ symbol, origin }))
              : Object.keys(tokenList).map((symbol) => item({ symbol, origin }))}
          </ul>
        </div>
      </div>
      <div className={s.footer}>
        <div className={s.edit} onClick={() => alert('준비 중입니다.')}>
          <RiEditBoxLine style={{ marginRight: '4px' }} /> 토큰 목록 관리
        </div>
      </div>
    </div>
  );
};

export default SelectTokenView;
