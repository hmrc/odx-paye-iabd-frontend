import React from 'react';
import { render, screen } from '@testing-library/react';
import DeductionHintText from './DeductionHintText';
import { AllowanceObject } from '../PayeCurrentYearTypes';

const tMock = jest.fn((key: string) => key);
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: tMock })
}));

const formatCurrencyMock = jest.fn((value?: string, truncate?: boolean) => {
  const v = value ?? '';
  return truncate ? `£${v}-truncated` : `£${v}`;
});

jest.mock('../../../../../components/helpers/utils', () => ({
  formatCurrency: (value?: string, truncate?: boolean) => formatCurrencyMock(value, truncate)
}));

const defaultDeduction: AllowanceObject = {
  AdjustedAmount: '100',
  SourceAmount: '200'
} as AllowanceObject;

const renderComponent = (explainerPage: string, deduction: AllowanceObject = defaultDeduction) =>
  render(<DeductionHintText explainerPage={explainerPage} deduction={deduction} />);

describe('Deduction hint text behaviour', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Given an explainer page is provided', () => {
    describe('When the explainer page is "untaxedsavingsinterest"', () => {
      it('Then the untaxed savings interest description is displayed', () => {
        renderComponent('untaxedsavingsinterest');

        expect(
          screen.getByText('UNTAXED_SAVINGS_INTEREST.UNTAXED_SAVINGS_INTEREST_LINK_DESCRIPTION')
        ).toBeInTheDocument();

        expect(tMock).toHaveBeenCalledWith(
          'UNTAXED_SAVINGS_INTEREST.UNTAXED_SAVINGS_INTEREST_LINK_DESCRIPTION'
        );
      });
    });

    describe('When the explainer page is "winterfuelpaymentcharge"', () => {
      it('Then the winter fuel payment hint with formatted amounts is displayed', () => {
        renderComponent('winterfuelpaymentcharge');

        expect(tMock).toHaveBeenCalledWith('WE_ADJUSTED_ALLOWANCES');
        expect(tMock).toHaveBeenCalledWith('TO_COLLECT_YOUR');
        expect(tMock).toHaveBeenCalledWith('WINTER_FUEL_PAYMENT_CHARGE');

        expect(formatCurrencyMock).toHaveBeenCalledWith('100', true);
        expect(formatCurrencyMock).toHaveBeenCalledWith('200', undefined);

        expect(
          screen.getByText(
            text =>
              text.includes('WE_ADJUSTED_ALLOWANCES') &&
              text.includes('£100-truncated') &&
              text.includes('TO_COLLECT_YOUR') &&
              text.includes('£200') &&
              text.includes('WINTER_FUEL_PAYMENT_CHARGE')
          )
        ).toBeInTheDocument();
      });
    });
  });
});
