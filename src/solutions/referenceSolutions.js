import { rtlDesignTemplates } from './rtlDesignSolution';
import { computerArchSolutions } from './computerArchSolution';
import { designVerSolutions } from './designVerificationSolution';

const EMPTY_BUNDLE = Object.freeze({
  rtl: { solution: '', testbench: '' },
  computerArchitecture: { solution: '', testbench: '' },
  designVerification: { solution: '' },
  recommendedDesign: '',
  recommendedTestbench: '',
});

export function getReferenceSolutions(question, language = 'systemverilog') {
  if (!question?.id) return EMPTY_BUNDLE;

  const rtl = rtlDesignTemplates(question.id, 'systemverilog') || { solution: '', testbench: '' };
  const computerArchitecture = computerArchSolutions(question.id, 'systemverilog') || { solution: '', testbench: '' };
  const designVerification = {
    solution: designVerSolutions(question.id, 'systemverilog') || '',
  };

  const recommendedDesign =
    question.domain === 'rtl-design'
      ? rtl.solution
      : question.domain === 'computer-architecture'
        ? computerArchitecture.solution
        : question.domain === 'design-verification'
          ? designVerification.solution
          : '';

  const recommendedTestbench =
    question.domain === 'rtl-design'
      ? rtl.testbench
      : question.domain === 'computer-architecture'
        ? computerArchitecture.testbench
        : '';

  return {
    rtl,
    computerArchitecture,
    designVerification,
    recommendedDesign,
    recommendedTestbench,
  };
}

export function extractComparisonCases(testbench = '') {
  if (!testbench) return [];

  const normalizeCase = (value = '') =>
    value
      .replace(/\s+/g, ' ')
      .replace(/^\s*(?:\/\/\s*)?/, '')
      .trim();

  const displayCases = [...testbench.matchAll(/\$display\(([^)]+)\);/g)]
    .map((match) => normalizeCase(match[1].replace(/["']/g, '')))
    .filter((value) => /^(?:PASS|FAIL|TC\d+|Test Case)/i.test(value));

  const commentCases = [
    ...testbench.matchAll(/\/\/\s*(Test Case[^\n]+)/g),
    ...testbench.matchAll(/\/\/\s*(TC\d+\s*[—-][^\n]+)/g),
  ].map((match) => normalizeCase(match[1]));

  return [...new Set([...commentCases, ...displayCases])].slice(0, 8);
}

export function buildEditorCodeSnapshot(files = []) {
  return files
    .map((file) => `// FILE: ${file.name}\n${file.content || ''}`)
    .join('\n\n');
}
