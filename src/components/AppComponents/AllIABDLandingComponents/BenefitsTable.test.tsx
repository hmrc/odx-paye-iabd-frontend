import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { CurrentListOBJ } from '../../../samples/app/iabd/PayeCurrentYear/PayeCurrentYearTypes';
import BenefitsTable from './BenefitsTable';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

jest.mock('@pega/auth/lib/sdk-auth-manager', () => ({
  getSdkConfig: jest.fn()
}));

const mockHandleLinkClick = jest.fn();

const mockData: CurrentListOBJ[] = [
  {
    EmploymentName: 'EmploymentName1',
    TESLinks: [
      {
        Content: [
          {
            pyKeyString: 'pyKeyString1',
            Language: 'en',
            pyURLContent: 'https://link.com',
            Name: 'Action1'
          }
        ]
      }
    ],

    Content: [
      {
        pyKeyString: 'pyKeyString1',
        Language: 'en',
        pyURLContent: 'https://link.com',
        Name: 'Action2'
      }
    ],
    Amount: 100.0
  }
];

describe('BenefitsTable', () => {
  it('renders table captions', () => {
    render(<BenefitsTable handleLinkClick={mockHandleLinkClick} displayList={mockData} />);

    expect(screen.getByText('BENEFITS')).toBeInTheDocument();
  });

  it('renders table headers', () => {
    render(<BenefitsTable handleLinkClick={mockHandleLinkClick} displayList={mockData} />);

    expect(screen.getByText('ITEM')).toBeInTheDocument();
    expect(screen.getByText('AMOUNT')).toBeInTheDocument();
    expect(screen.getByText('EMPLOYMENT')).toBeInTheDocument();
    expect(screen.getByText('ACTIONS')).toBeInTheDocument();
  });

  it('renders the appropriate message when the display list is empty', () => {
    render(<BenefitsTable handleLinkClick={mockHandleLinkClick} displayList={[]} />);

    expect(screen.getByText('NO_BENEFITS')).toBeInTheDocument();
  });

  it('calls handleLinkClick when a link is clicked', () => {
    render(<BenefitsTable handleLinkClick={mockHandleLinkClick} displayList={mockData} />);

    const link = screen.getByText('Action1');
    fireEvent.click(link);

    expect(mockHandleLinkClick).toHaveBeenCalledWith('https://link.com');
  });

  it('renders the appropriate message when no link is available', () => {
    const mockDataNoLinks: CurrentListOBJ[] = [
      {
        EmploymentName: 'EmploymentName2',
        Content: [{ pyKeyString: 'pyKeyString2', Language: 'en', Name: 'Action4' }],
        Amount: 100.0
      }
    ];

    render(<BenefitsTable handleLinkClick={mockHandleLinkClick} displayList={mockDataNoLinks} />);

    expect(screen.getByText('NO_ACTIONS')).toBeInTheDocument();
  });

  it('renders the hidden span with link name followed by IABD Benefit type', () => {
    render(<BenefitsTable handleLinkClick={mockHandleLinkClick} displayList={mockData} />);

    expect(screen.getByText('Action1 Action2')).toBeInTheDocument();
  });
});
