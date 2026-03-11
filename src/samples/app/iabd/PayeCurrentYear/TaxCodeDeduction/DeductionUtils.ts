// TODO: Need to create a separate constants file for better maintainability and reusability
// for addressing the issue of hardcoded values in the codebase.
export default function isKnownExplainerPage(page: string): boolean {
  const KNOWN_EXPLAINER_PAGES = ['untaxedsavingsinterest', 'winterfuelpaymentcharge'];
  return KNOWN_EXPLAINER_PAGES.includes(page);
}
