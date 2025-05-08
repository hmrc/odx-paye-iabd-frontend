import React from 'react';
import { useTranslation } from 'react-i18next';

const Pagination = ({ currentPage, totalPages, onPageChange, ariaLabel }) => {
  const generateKey = (prefix, index) => `${prefix}_${index}_pagination`;
  const { t } = useTranslation();

  return (
    <nav className='govuk-pagination govuk-grid-column-full' aria-label={ariaLabel}>
      {currentPage > 1 && (
        <div className='govuk-pagination__prev'>
          <a
            className='govuk-link govuk-pagination__link'
            href='#'
            onClick={() => onPageChange(currentPage - 1)}
          >
            {t('PREVIOUS')}
          </a>
        </div>
      )}

      <ul className='govuk-pagination__list'>
        {Array.from({ length: totalPages }).map((_, index) => (
          <li
            key={generateKey('page', index)}
            className={`govuk-pagination__item ${currentPage === index + 1 ? 'govuk-pagination__item--current' : ''}`}
          >
            <a
              className='govuk-link govuk-pagination__link'
              href='#'
              onClick={() => onPageChange(index + 1)}
            >
              {index + 1}
            </a>
          </li>
        ))}
      </ul>

      {currentPage < totalPages && (
        <div className='govuk-pagination__next'>
          <a
            className='govuk-link govuk-pagination__link'
            href='#'
            onClick={() => onPageChange(currentPage + 1)}
          >
            {t('NEXT')}
          </a>
        </div>
      )}
    </nav>
  );
};

export default Pagination;
