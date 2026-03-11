import { render, act } from '@testing-library/react';
import RenderReactCategory from './RenderReactCategory';

jest.mock('./constant/templateNameMap', () => ({
  __esModule: true,
  default: { REF123: 'MockTemplate' }
}));

jest.mock('react', () => {
  const Actual = jest.requireActual('react');
  return {
    ...Actual,
    memo: (c: any) => c
  };
});

const MockTemplateComponent = jest.fn(() => (
  <div data-testid='mock-template'>Rendered Template</div>
));

jest.mock(
  './categoryTypeReact/MockTemplate',
  () => ({
    __esModule: true,
    default: MockTemplateComponent
  }),
  { virtual: true }
);

describe('RenderReactCategory', () => {
  describe('Given no templateName', () => {
    describe('When component renders', () => {
      it('Then it should render nothing and match snapshot', async () => {
        const { container } = render(<RenderReactCategory item={{}} lang='en' />);
        expect(container).toMatchSnapshot();
      });
    });
  });

  describe('Given a valid templateName', () => {
    describe('When template loads successfully', () => {
      it('Then it should render the loaded template and match snapshot', async () => {
        const { container } = render(
          <RenderReactCategory item={{ ReferenceID: 'REF123', data: '001' }} lang='en' />
        );
        expect(container).toMatchSnapshot();
      });
    });
  });

  describe('Given an invalid template import', () => {
    describe('When dynamic import fails', () => {
      beforeAll(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
      });

      it('Then it should render nothing and match snapshot', async () => {
        const { container } = render(
          <RenderReactCategory item={{ ReferenceID: 'INVALID' }} lang='en' />
        );
        await act(async () => {});
        expect(container).toMatchSnapshot();
      });
    });
  });
});
