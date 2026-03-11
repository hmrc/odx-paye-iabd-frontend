import { render, screen, act } from '@testing-library/react';
import WhyExplainer from '.';
import type { WhyExplainerItem } from './index';
import { setupPCore } from '../../../../../../../tests/mocks/pCoreMocks';

jest.mock('../../../../../../components/helpers/utils', () => ({
  getCurrentLang: jest.fn(() => 'en')
}));

jest.mock('./RenderReactCategory', () => ({
  __esModule: true,
  default: ({ item, lang }: any) => (
    <div>
      R-{item.ReferenceID}-{lang}
    </div>
  )
}));

describe('WhyExplainer Component', () => {
  let mocks: ReturnType<typeof setupPCore>;

  const renderComponent = (overrideProps = {}) => {
    const props = {
      items: [],
      ...overrideProps
    };
    return render(<WhyExplainer {...props} />);
  };

  beforeEach(() => {
    mocks = setupPCore();
  });

  describe('Given an empty items array', () => {
    beforeEach(() => {
      renderComponent({ items: [] });
    });

    describe('When rendered', () => {
      it('Then it shows an empty list', () => {
        expect(screen.getByRole('list')).toBeInTheDocument();
        expect(screen.queryAllByRole('listitem')).toHaveLength(0);
      });
    });
  });

  describe('Given an unknown category item', () => {
    const items = [
      {
        Category: 'Unknown',
        ReferenceID: 'test-ref',
        Content: [{ Language: 'EN', Description: 'Unknown Content' }]
      }
    ];

    it('Then it renders nothing for Unknown Category', () => {
      const { container } = renderComponent({ items });
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('Given a Pega item with matching language but no Description', () => {
    const items = [
      {
        Category: 'Pega',
        ReferenceID: 'test-ref',
        Content: [{ Language: 'EN', Description: null }]
      }
    ];

    it('Then it returns null for missing Description', () => {
      const { container } = renderComponent({ items });
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('Given a Pega item with no Content field', () => {
    const items = [
      {
        Category: 'Pega',
        ReferenceID: 'NO_CONTENT'
        // Content is not present"
      }
    ];

    it('Then renderContent handles missing Content safely and returns null', () => {
      const { container } = renderComponent({ items });

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('Given a single Pega item', () => {
    const items = [
      {
        Category: 'Pega',
        ReferenceID: '1',
        Content: [
          { Language: 'EN', Description: 'English Pega Content' },
          { Language: 'CY', Description: 'Welsh Pega Content' }
        ]
      }
    ];

    beforeEach(() => {
      renderComponent({ items });
    });

    describe('When rendered with EN language', () => {
      it('Then it shows English description', () => {
        expect(screen.getByText('English Pega Content')).toBeInTheDocument();
        expect(screen.queryByText('Welsh Pega Content')).not.toBeInTheDocument();
      });

      it('Then it renders a single list item', () => {
        expect(screen.getByText('English Pega Content')).toBeInTheDocument();
      });
    });
  });

  describe('Given multiple Pega items', () => {
    const items = [
      { Category: 'Pega', ReferenceID: 'A', Content: [{ Language: 'EN', Description: 'A EN' }] },
      { Category: 'Pega', ReferenceID: 'B', Content: [{ Language: 'EN', Description: 'B EN' }] }
    ];

    beforeEach(() => {
      renderComponent({ items });
    });

    describe('When rendered', () => {
      it('Then it outputs list items for all rows', () => {
        expect(screen.getAllByRole('listitem')).toHaveLength(2);
        expect(screen.getByText('A EN')).toBeInTheDocument();
        expect(screen.getByText('B EN')).toBeInTheDocument();
      });
    });
  });

  describe('Given a React category item', () => {
    const items = [{ Category: 'React', ReferenceID: 'Template1', DIG_Title: 'Hello' }];

    beforeEach(() => {
      renderComponent({ items });
    });

    describe('When rendered', () => {
      it('Then it renders React category output', () => {
        expect(screen.getByText('R-Template1-EN')).toBeInTheDocument();
      });
    });
  });

  describe('Given mixed category items', () => {
    const items = [
      {
        Category: 'Pega',
        ReferenceID: '1',
        Content: [{ Language: 'EN', Description: 'Pega Item' }]
      },
      { Category: 'React', ReferenceID: 'Template1', DIG_Title: 'React Item' }
    ];

    beforeEach(() => {
      renderComponent({ items });
    });

    describe('When rendered', () => {
      it('Then it renders both Pega and React items', () => {
        expect(screen.getByText('Pega Item')).toBeInTheDocument();
        expect(screen.getByText('R-Template1-EN')).toBeInTheDocument();
      });
    });
  });

  describe('Given a language change event', () => {
    const items = [
      {
        Category: 'Pega',
        ReferenceID: 'P1',
        Content: [
          { Language: 'EN', Description: 'EN TEXT' },
          { Language: 'CY', Description: 'CY TEXT' }
        ]
      }
    ];

    beforeEach(() => {
      renderComponent({ items });
    });

    describe('When the event fires', () => {
      it('Then it updates displayed content based on language', () => {
        expect(screen.getByText('EN TEXT')).toBeInTheDocument();
        const callback = mocks.pubSub.subscribe.mock.calls[0][1] as (event: any) => void;
        act(() => {
          callback({ language: 'cy' });
        });
        expect(screen.getByText('CY TEXT')).toBeInTheDocument();
      });
    });

    describe('When unmounted', () => {
      it('Then it unsubscribes from PCore events', () => {
        const { unmount } = renderComponent({ items });
        unmount();
        expect(mocks.unsubscribe).toHaveBeenCalledWith(
          'languageToggleTriggered',
          'languageToggleTriggered'
        );
      });
    });
  });

  describe('Given Pega item with missing language content', () => {
    const items = [
      {
        Category: 'Pega',
        ReferenceID: '2',
        Content: [{ Language: 'EN', Description: 'Only English' }]
      }
    ];

    beforeEach(() => {
      renderComponent({ items });
    });

    describe('When rendered', () => {
      it('Then it displays the available language content', () => {
        expect(screen.getByText('Only English')).toBeInTheDocument();
      });
    });
  });

  describe('Given props update with new items', () => {
    const initialItems: WhyExplainerItem[] = [
      { Category: 'Pega', ReferenceID: '1', Content: [{ Language: 'EN', Description: 'Initial' }] }
    ];
    const updatedItems: WhyExplainerItem[] = [
      { Category: 'Pega', ReferenceID: '2', Content: [{ Language: 'EN', Description: 'Updated' }] }
    ];

    describe('When items prop changes', () => {
      it('Then it re-renders with new items', () => {
        const { rerender } = renderComponent({ items: initialItems });
        expect(screen.getByText('Initial')).toBeInTheDocument();

        rerender(<WhyExplainer items={updatedItems} />);
        expect(screen.getByText('Updated')).toBeInTheDocument();
        expect(screen.queryByText('Initial')).not.toBeInTheDocument();
      });
    });
  });
});
