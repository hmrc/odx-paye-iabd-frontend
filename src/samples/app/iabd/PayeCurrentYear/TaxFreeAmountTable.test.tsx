import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaxFreeAmountTable from './TaxFreeAmountTable';
import { mockGetSdkConfigWithBasepath } from '../../../../../tests/mocks/getSdkConfigMock';
import { act } from 'react-dom/test-utils';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

describe('Changes in tax free amount details component', () => {
  afterEach(cleanup);

  beforeEach(async () => {
    mockGetSdkConfigWithBasepath();
  });

  test('Should render the heading changes to your tax code and amount', async () => {
    const taxDetails = [
      {
        pyNote: 'Now',
        NetCodedAllowance: '12570',
        AssignedTaxCode: '1257L'
      },
      {
        pyNote: 'Before',
        NetCodedAllowance: null,
        AssignedTaxCode: null
      }
    ];
    await act(async () => {
      render(<TaxFreeAmountTable taxDetails={taxDetails} />);
    });

    expect(screen.getByText('Changes to your tax code and tax-free amount')).toBeInTheDocument();
  });

  test('Should render the current tax code and tax free amount details and not applicable for before section', async () => {
    const taxDetails = [
      {
        pyNote: 'Now',
        NetCodedAllowance: '12570',
        AssignedTaxCode: '1257L'
      },
      {
        pyNote: 'Before',
        NetCodedAllowance: null,
        AssignedTaxCode: null
      }
    ];
    await act(async () => {
      render(<TaxFreeAmountTable taxDetails={taxDetails} />);
    });

    expect(screen.getByText('Item')).toBeInTheDocument();
    expect(screen.getByText('Before this change')).toBeInTheDocument();
    expect(screen.getByText('Now')).toBeInTheDocument();
    expect(screen.getByText('Tax code')).toBeInTheDocument();
    expect(screen.getByText('Tax-free amount')).toBeInTheDocument();
    expect(screen.getByText('1257L')).toBeInTheDocument();
    expect(screen.getByText('£12,570')).toBeInTheDocument();
    const beforeNotApplicable = screen.getAllByText('Not applicable');
    expect(beforeNotApplicable).toHaveLength(2);
  });

  test('Should render the current and before tax code and tax free amount details', async () => {
    const taxDetails = [
      {
        pyNote: 'Now',
        NetCodedAllowance: '12570',
        AssignedTaxCode: '1257L'
      },
      {
        pyNote: 'Before',
        NetCodedAllowance: '8510',
        AssignedTaxCode: '851N'
      }
    ];
    await act(async () => {
      render(<TaxFreeAmountTable taxDetails={taxDetails} />);
    });

    expect(screen.getByText('Item')).toBeInTheDocument();
    expect(screen.getByText('Before this change')).toBeInTheDocument();
    expect(screen.getByText('Now')).toBeInTheDocument();
    expect(screen.getByText('Tax code')).toBeInTheDocument();
    expect(screen.getByText('Tax-free amount')).toBeInTheDocument();
    expect(screen.getByText('1257L')).toBeInTheDocument();
    expect(screen.getByText('£12,570')).toBeInTheDocument();
    expect(screen.getByText('£8,510')).toBeInTheDocument();
    expect(screen.getByText('851N')).toBeInTheDocument();
  });
});
