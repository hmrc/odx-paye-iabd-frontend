import React, { useState, useEffect } from 'react';
import Button from '../../../../components/BaseComponents/Button/Button';
import { useTranslation } from 'react-i18next';
import setPageTitle from '../../../../components/helpers/setPageTitleHelpers';
import useServiceShuttered from '../../../../components/helpers/hooks/useServiceShuttered';
import ShutterServicePage from '../../../../components/AppComponents/ShutterServicePage';
import MainWrapperFull from '../../../../components/BaseComponents/MainWrapper/MainWrapperFull';
import i18next from 'i18next';

interface InterruptionPageProps {
  onBack?: () => void;
  employmentSequenceNumber: number | null;
  handleNavClick: (e: any, url: any) => void;
}

const InterruptionPage: React.FC<InterruptionPageProps> = ({
  onBack,
  employmentSequenceNumber,
  handleNavClick
}) => {
  const { t } = useTranslation();
  const serviceShuttered = useServiceShuttered();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setPageTitle(showError);
  }, [showError, i18next.language]);

  const handleContinueClick = (e: any) => {
    if (!selectedOption) {
      setShowError(true);
      return;
    }
    if (selectedOption === 'yes') {
      handleNavClick(
        e,
        `/check-income-tax/update-income/how-to-update-income/${employmentSequenceNumber}`
      );
    } else if (selectedOption === 'no') {
      onBack?.();
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
    setShowError(false);
  };

  const describedByIDs: string[] = [];
  const errorID = 'taxableIncome-error';
  if (showError) {
    describedByIDs.push(errorID);
  }
  const ariaDescBy =
    describedByIDs.length !== 0 ? { 'aria-describedby': describedByIDs.join(' ') } : {};

  return (
    <>
      {!serviceShuttered && (
        <>
          <Button
            variant='backlink'
            onClick={onBack}
            key='StartPageBacklink'
            attributes={{ type: 'link' }}
          />
          <MainWrapperFull>
            <div className='govuk-grid-row'>
              <div className='govuk-grid-column-two-thirds'>
                {showError && (
                  <div className='govuk-error-summary' data-module='govuk-error-summary'>
                    <div role='alert'>
                      <h2 className='govuk-error-summary__title'>{t('THERE_IS_A_PROBLEM')}</h2>
                      <div className='govuk-error-summary__body'>
                        <ul className='govuk-list govuk-error-summary__list'>
                          <li>
                            <a href='#taxableIncome'>{t('SELECT_YES_IF_YOU_WANT_TO_UPDATE')}</a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <h1 className='govuk-heading-l'>{t('UPDATE_ESTIMATED_PAY')}</h1>
                <p className='govuk-body'>{t('IN_THE_VAST_MAJORITY_OF_CASES_YOUR_TAX_CODE')}</p>
                <ul className='govuk-list govuk-list--bullet govuk-!-margin-bottom-6'>
                  <li>{t('TOTAL_TAXABLE_INCOME_THIS_YEAR')}</li>
                  <li>{t('UNTAXED_INTEREST')}</li>
                  <li>{t('OF_DIVIDENTS')}</li>
                </ul>

                <p className='govuk-body'>{t('IF_YOUR_NEW_ESTIMATED_TAXABLE_INCOME')}</p>
                <p className='govuk-body'>{t('UPDATE_YOUR_ESTIMATED_TAXABLE_INCOME')}</p>
                <p className='govuk-body'>{t('IF_YOU_YOUR_PARTNER_ARE_CLAIMING_CHILD_BENEFIT')}</p>
                <p className='govuk-body'>
                  {t('FOR_MORE_INFORMATION')}
                  <a
                    lang='en'
                    className='govuk-link hmrc-report-technical-issue '
                    rel='noreferrer noopener'
                    target='_blank'
                    href='https://www.gov.uk/child-benefit-tax-charge'
                  >
                    {t('READ_THE_GUIDANCE_ON_HIGH_INCOME')}
                  </a>
                  .
                </p>
                <div className={`govuk-form-group ${showError ? 'govuk-form-group--error' : ''}`}>
                  <fieldset className='govuk-fieldset' {...ariaDescBy}>
                    <legend className='govuk-fieldset__legend govuk-fieldset__legend--l'>
                      <h2 className='govuk-heading-m'>
                        {t('DO_YOU_STILL_WANT_TO_UPDATE_YOUR_ESTIMATED_TAXABLE_INCOME')}
                      </h2>
                    </legend>
                    {showError && (
                      <p className='govuk-error-message' id='taxableIncome-error'>
                        <span className='govuk-visually-hidden'>{t('ERROR')}:</span>
                        {t('SELECT_YES_IF_YOU_WANT_TO_UPDATE')}
                      </p>
                    )}
                    <div className='govuk-radios govuk-radios--inline' data-module='govuk-radios'>
                      <div className='govuk-radios__item'>
                        <input
                          className='govuk-radios__input'
                          id='taxableIncome'
                          name='taxableIncome'
                          type='radio'
                          value='yes'
                          onChange={handleRadioChange}
                        />
                        <label className='govuk-label govuk-radios__label' htmlFor='taxableIncome'>
                          {t('YES')}
                        </label>
                      </div>
                      <div className='govuk-radios__item'>
                        <input
                          className='govuk-radios__input'
                          id='taxableIncome-2'
                          name='taxableIncome'
                          type='radio'
                          value='no'
                          onChange={handleRadioChange}
                        />
                        <label
                          className='govuk-label govuk-radios__label'
                          htmlFor='taxableIncome-2'
                        >
                          {t('NO')}
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div>
                  <Button onClick={handleContinueClick}>{t('CONTINUE')}</Button>
                </div>
              </div>
            </div>
          </MainWrapperFull>
        </>
      )}
      {serviceShuttered && <ShutterServicePage />}
    </>
  );
};

export default InterruptionPage;
