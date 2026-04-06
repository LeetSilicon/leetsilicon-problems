/**
 * Debug Code Question Bank
 * Maps RTL Debug Waveform Challenges to the question bank format.
 */
import RTL_DEBUG_WAVEFORM_CHALLENGES from './rtlDebugChallenges';

const getDebugCodeQuestionBank = () => ({
  'Waveform Debug Challenges': RTL_DEBUG_WAVEFORM_CHALLENGES.map((challenge) => ({
    id: challenge.id,
    shortName: challenge.title.split('—')[0].trim(),
    question: challenge.title,
    description: `${challenge.summary} Use the Simulate Code tab with waveforms/logs to identify and fix the RTL issue.`,
    difficulty: challenge.difficulty,
    topics: ['RTL Debug', 'Waveform', challenge.category, challenge.bugType],
    requirements: [
      'Use the Simulate Code tab and inspect the provided buggy RTL + waveform signals.',
      'Identify the root cause (not just the symptom) and implement a fix in design.sv.',
      ...((challenge.expectedBehavior || []).map((x) => `Expected Behavior: ${x}`)),
    ],
    hints: challenge.hints || [],
    debugChallengeId: challenge.id
  }))
});

export default getDebugCodeQuestionBank;
