export type PyNote = 'Before' | 'Now';

export type TaxDetail = {
  pyNote?: PyNote;
  AssignedTaxCode?: string | null;
};
