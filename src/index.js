/**
 * Question Bank — Central Index
 * Merges all domain question files into one bank.
 */
import computerArchitecture from './domains/computerArchitecture';
import rtlDesign from './domains/rtlDesign';
import designVerification from './domains/designVerification';
import programming from './domains/programming';

export const getDefaultQuestionBank = () => ({
  'computer-architecture': computerArchitecture,
  'rtl-design': rtlDesign,
  'design-verification': designVerification,
  'programming': programming,
});

export { computerArchitecture, rtlDesign, designVerification, programming };
