import { render, screen } from '@testing-library/react';
import WhatExplainer from '.';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

describe('WhatExplainer Component', () => {
  const renderComponent = (overrideProps = {}) => {
    const props = {
      monthlyEarnings: '200',
      ...overrideProps
    };

    return render(<WhatExplainer {...props} />);
  };

  describe('Given monthlyEarnings is null', () => {
    beforeEach(() => {
      renderComponent({ monthlyEarnings: null });
    });

    describe('When the component renders', () => {
      it('Then it should render nothing (null)', () => {
        expect(screen.queryByText('BASED_ON_CURRENT_INCOME')).not.toBeInTheDocument();
      });
    });
  });

  describe('Given monthlyEarnings is a positive number', () => {
    beforeEach(() => {
      renderComponent({ monthlyEarnings: '250' });
    });

    describe('When the component loads', () => {
      it('Then it displays MORE in the first paragraph', () => {
        expect(
          screen.getByText(/BASED_ON_CURRENT_INCOME £250 MORE EVERY_MONTH/)
        ).toBeInTheDocument();
      });

      it('Then it renders the second explanatory paragraph', () => {
        expect(screen.getByText('THIS_AMOUNT_IS_AN_ESTIMATE')).toBeInTheDocument();
      });
    });
  });

  describe('Given monthlyEarnings is zero', () => {
    beforeEach(() => {
      renderComponent({ monthlyEarnings: '0' });
    });

    describe('When the value is zero', () => {
      it('Then it displays LESS', () => {
        expect(screen.getByText(/BASED_ON_CURRENT_INCOME £0 LESS EVERY_MONTH/)).toBeInTheDocument();
      });
    });
  });

  describe('Given monthlyEarnings is a negative number', () => {
    beforeEach(() => {
      renderComponent({ monthlyEarnings: '-50' });
    });

    describe('When the value is negative', () => {
      it('Then it still displays LESS (because number <= 0)', () => {
        expect(
          screen.getByText(/BASED_ON_CURRENT_INCOME £-50 LESS EVERY_MONTH/)
        ).toBeInTheDocument();
      });
    });
  });
});
