import React from 'react';
import { render, screen } from '@testing-library/react';
import { formatTaxCode } from '../../../../../../components/helpers/utils';
import HowExplainer from '.';
import { PyNote } from '../typings';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

jest.mock('../../../../../../components/helpers/utils', () => ({
  formatTaxCode: jest.fn(code => `formatted-${code}`)
}));

const mockTaxDetails: { pyNote: PyNote; AssignedTaxCode: string }[] = [
  { pyNote: 'Before' as PyNote, AssignedTaxCode: '1250L' },
  { pyNote: 'Now' as PyNote, AssignedTaxCode: '1280L' }
];

describe('HowExplainer Component', () => {
  const renderComponent = (overrideProps = {}) => {
    const props = {
      employerName: 'HMRC',
      activeOccupationalPension: false,
      taxDetails: mockTaxDetails,
      ...overrideProps
    };

    return render(<HowExplainer {...props} />);
  };

  describe('Given the component is rendered with default props', () => {
    beforeEach(() => {
      renderComponent();
    });

    describe('When the component loads', () => {
      it('Then it renders the first paragraph with employer name', () => {
        expect(screen.getByText(/NO_ACTION_NEEDED_EMPLOYMENT_AT HMRC\./)).toBeInTheDocument();
      });

      it('Then it renders the explanation paragraphs', () => {
        expect(screen.getByText('THIS_MEANS_TAX_CODE_WILL_CHANGE_ACCORDINGLY')).toBeInTheDocument();
      });

      it('Then it displays PAY when activeOccupationalPension is false', () => {
        expect(
          screen.getByText(/NO_ACTION_NEEDED_VIA_PENSION_OR_PAY_AT PAY AT HMRC/)
        ).toBeInTheDocument();
      });

      it('Then it shows the formatted before → now tax code change', () => {
        expect(formatTaxCode).toHaveBeenCalledWith('1250L');
        expect(formatTaxCode).toHaveBeenCalledWith('1280L');

        expect(
          screen.getByText(
            /THIS_MEANS_TAX_CODE_WILL_CHANGE_FROM_TO formatted-1250L TO formatted-1280L\./
          )
        ).toBeInTheDocument();
      });

      it('Then it renders a link', () => {
        const link = screen.getByRole('link', {
          name: 'CHECK_HOW_WE_WORKED_OUT_YOUR_NEW_CODE_AND_TFA'
        });

        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/test');
      });
    });
  });

  describe('Given activeOccupationalPension is true', () => {
    beforeEach(() => {
      renderComponent({ activeOccupationalPension: true });
    });

    describe('When the pension flag is enabled', () => {
      it('Then it displays PENSION instead of PAY', () => {
        expect(
          screen.getByText(/NO_ACTION_NEEDED_VIA_PENSION_OR_PAY_AT PENSION AT HMRC/)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Given a different employer name', () => {
    beforeEach(() => {
      renderComponent({ employerName: 'Tesco' });
    });

    describe('When the component renders with a different employer', () => {
      it('Then it updates all employerName references', () => {
        expect(screen.getByText(/NO_ACTION_NEEDED_EMPLOYMENT_AT Tesco\./)).toBeInTheDocument();
        expect(
          screen.getByText(/NO_ACTION_NEEDED_VIA_PENSION_OR_PAY_AT PAY AT Tesco/)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Given tax details include Before and Now codes', () => {
    it('Then it correctly finds the tax codes by pyNote', () => {
      renderComponent();

      expect(formatTaxCode).toHaveBeenCalledWith('1250L');
      expect(formatTaxCode).toHaveBeenCalledWith('1280L');
    });
  });
});
