import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaxFreeAmountDetails from './TaxFreeAmountDetails';
import { mockGetSdkConfigWithBasepath } from '../../../../../tests/mocks/getSdkConfigMock';
import { act } from 'react-dom/test-utils';

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

const TEST_PAGE = 'TestPage';

const EXPLAINER_PAGES = {
  UNTAXED_SAVINGS: 'untaxedsavingsinterest',
  WINTER_FUEL: 'winterfuelpaymentcharge'
};

const buildContent = (name: string) => [
  { pyKeyString: name, Language: 'EN', Name: name },
  { pyKeyString: name, Language: 'CY', Name: `${name} - Welsh` }
];

const buildTESLink = (name: string, url: string) => [
  {
    Content: [
      {
        pyKeyString: name,
        Language: 'EN',
        pyURLContent: url,
        Name: name
      },
      {
        pyKeyString: name,
        Language: 'CY',
        pyURLContent: url,
        Name: `${name} - Welsh`
      }
    ]
  }
];

const buildDeduction = ({
  name,
  explainerPage,
  adjustedAmount = '100',
  sourceAmount = '100'
}: {
  name: string;
  explainerPage?: string;
  adjustedAmount?: string;
  sourceAmount?: string;
}) => ({
  Content: buildContent(name),
  TESLinks: explainerPage ? buildTESLink(name, explainerPage) : undefined,
  AdjustedAmount: adjustedAmount,
  SourceAmount: sourceAmount
});

const renderComponent = async ({
  allowances = [],
  personalAllowances = [],
  deductions = [],
  handleLinkClick = jest.fn(),
  redirectToDeductionExplainerpage = jest.fn()
} = {}) => {
  mockGetSdkConfigWithBasepath();

  await act(async () => {
    render(
      <TaxFreeAmountDetails
        allowances={allowances}
        personalAllowances={personalAllowances}
        deductions={deductions}
        handleLinkClick={handleLinkClick}
        redirectToDeductionExplainerpage={redirectToDeductionExplainerpage}
        comingFrom={TEST_PAGE}
      />
    );
  });

  return { handleLinkClick, redirectToDeductionExplainerpage };
};

afterEach(cleanup);

describe('Tax free amount details behaviour', () => {
  describe('Given explainer deductions are present', () => {
    test.each([
      {
        scenario: 'Untaxed savings interest explainer',
        deduction: buildDeduction({
          name: 'Untaxed savings interest',
          explainerPage: EXPLAINER_PAGES.UNTAXED_SAVINGS,
          adjustedAmount: '200',
          sourceAmount: '200'
        }),
        expectedPage: EXPLAINER_PAGES.UNTAXED_SAVINGS,
        expectedSourceAmount: '200'
      },
      {
        scenario: 'Winter fuel payment charge explainer',
        deduction: buildDeduction({
          name: 'Winter Fuel Payment Charge',
          explainerPage: EXPLAINER_PAGES.WINTER_FUEL,
          adjustedAmount: '300',
          sourceAmount: '600'
        }),
        expectedPage: EXPLAINER_PAGES.WINTER_FUEL,
        expectedSourceAmount: '600'
      }
    ])(
      'When the user clicks the explainer link, then they are redirected to the explainer page',
      async ({ deduction, expectedPage, expectedSourceAmount }) => {
        const { redirectToDeductionExplainerpage } = await renderComponent({
          deductions: [deduction]
        });

        const link = screen.getByText(deduction.Content[0].Name);
        fireEvent.click(link);

        expect(redirectToDeductionExplainerpage).toHaveBeenCalledWith(
          TEST_PAGE,
          expectedPage,
          expectedSourceAmount
        );
      }
    );
  });
});
