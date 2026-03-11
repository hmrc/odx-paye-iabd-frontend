import { useTranslation } from 'react-i18next';
import { TaxDetail } from '../typings';
import { Link } from 'hmrc-gds-react-components';
import { formatTaxCode } from '../../../../../../components/helpers/utils';

interface Props {
  employerName: string;
  activeOccupationalPension: boolean;
  taxDetails: TaxDetail[];
}

const NOW_KEY = 'Now';
const BEFORE_KEY = 'Before';

const HowExplainer: React.FC<Props> = ({ employerName, activeOccupationalPension, taxDetails }) => {
  const { t } = useTranslation();

  const nowTaxCode = taxDetails.find(item => item.pyNote === NOW_KEY).AssignedTaxCode;
  const beforeTaxCode = taxDetails.find(item => item.pyNote === BEFORE_KEY).AssignedTaxCode;

  return (
    <>
      <p className='govuk-body'>
        {t('NO_ACTION_NEEDED_EMPLOYMENT_AT')} {employerName}.
      </p>

      <p className='govuk-body'>{t('THIS_MEANS_TAX_CODE_WILL_CHANGE_ACCORDINGLY')}</p>

      <p className='govuk-body'>
        {t('NO_ACTION_NEEDED_VIA_PENSION_OR_PAY_AT')}{' '}
        {activeOccupationalPension ? t('PENSION') : t('PAY')} {t('AT')} {employerName}{' '}
        {t('AND_REDUCE_YOUR_TAX_FREE_AMOUNT')}
      </p>

      <p className='govuk-!-margin-top-3'>
        {t('THIS_MEANS_TAX_CODE_WILL_CHANGE_FROM_TO')} {formatTaxCode(beforeTaxCode)} {t('TO')}{' '}
        {formatTaxCode(nowTaxCode)}.
      </p>

      <p className='govuk-!-margin-top-3'>
        <Link href='/test'>{t('CHECK_HOW_WE_WORKED_OUT_YOUR_NEW_CODE_AND_TFA')}</Link>
      </p>
    </>
  );
};

export default HowExplainer;
