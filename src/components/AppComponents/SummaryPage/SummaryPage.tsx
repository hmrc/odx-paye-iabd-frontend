import { forwardRef, useEffect } from 'react';
import MainWrapper from '../../BaseComponents/MainWrapper';
import Button from '../../BaseComponents/Button/Button';
import ParsedHTML from '../../helpers/formatters/ParsedHtml';
import setPageTitle from '../../helpers/setPageTitleHelpers';

interface SummaryPageProps {
  summaryTitle: string;
  summaryContent: string;
  summaryBanner: string;
  backlinkProps: {
    backlinkAction: () => void;
    backlinkText: string;
  };
}

const SummaryPage = forwardRef<HTMLDivElement, any>((props: SummaryPageProps, ref) => {
  const { summaryTitle, summaryContent, summaryBanner, backlinkProps } = props;
  const { backlinkAction, backlinkText } = backlinkProps;

  useEffect(() => {
    setPageTitle();
  }, [summaryTitle, summaryBanner]);

  return (
    <>
      {!summaryBanner && summaryContent && backlinkAction && (
        <Button variant='backlink' onClick={backlinkAction}>
          {backlinkText}
        </Button>
      )}
      <MainWrapper title={summaryBanner && summaryBanner !== '' ? summaryBanner : summaryTitle}>
        {summaryBanner && summaryBanner !== '' ? (
          <div className='govuk-panel govuk-panel--confirmation govuk-!-margin-bottom-7'>
            <h1 className='govuk-panel__title'> {summaryBanner} </h1>
          </div>
        ) : (
          <h1 className='govuk-heading-l'>{summaryTitle}</h1>
        )}
        <div ref={ref}>
          <ParsedHTML htmlString={summaryContent} />
        </div>
      </MainWrapper>
    </>
  );
});

export default SummaryPage;
