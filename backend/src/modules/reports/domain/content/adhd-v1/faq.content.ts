import type { FaqItem } from '../../interfaces/report-section.interface';

// Only the first answer of each list comes from the mockups; the rest is
// short, neutral copy written in the same tone.

export const HIGH_TRAITS_FAQ: FaqItem[] = [
  {
    question: 'Does a high ADHD score mean I have ADHD?',
    answer: 'This score suggests significant ADHD traits, but an official diagnosis requires professional evaluation.'
  },
  {
    question: 'Can ADHD traits be strengths?',
    answer:
      'Yes. Many people with ADHD traits bring creativity, energy, and the ability to hyperfocus on what interests them. Understanding your traits helps you build on these strengths.'
  },
  {
    question: 'What strategies can help manage high ADHD traits?',
    answer:
      'Clear routines, breaking tasks into smaller steps, reminders and timers, and regular breaks can all help. A healthcare professional can suggest approaches that fit you best.'
  },
  {
    question: 'Does this score mean I struggle with emotional regulation?',
    answer:
      'Not necessarily. ADHD traits affect emotions differently for each person. The score highlights tendencies, not a fixed outcome.'
  },
  {
    question: 'How can I stay organized with high ADHD traits?',
    answer:
      'Simple systems work best: one calendar, short to-do lists, fixed places for everyday items, and reminders for important tasks.'
  },
  {
    question: 'Can my ADHD trait levels change over time?',
    answer:
      'Yes. Stress, sleep, life circumstances, and coping strategies can influence how strongly traits show up. Retaking the test later can help you notice changes.'
  }
];

export const LOW_TRAITS_FAQ: FaqItem[] = [
  {
    question: "Does a low ADHD score mean I definitely don't have ADHD?",
    answer:
      'A low score suggests minimal ADHD traits, but if you have concerns, a professional evaluation can provide a definitive answer.'
  },
  {
    question: 'Can I still benefit from brain training with low ADHD traits?',
    answer: 'Yes. Brain training can help keep your focus, memory, and mental flexibility sharp, whatever your score.'
  },
  {
    question: 'What can I do to maintain my strong cognitive performance?',
    answer:
      'Regular sleep, physical activity, balanced routines, and mentally challenging activities all help keep your mind in good shape.'
  },
  {
    question: 'Can my ADHD trait levels change over time?',
    answer:
      'Yes. Stress, sleep, life circumstances, and daily habits can influence how traits show up. Retaking the test later can help you notice changes.'
  },
  {
    question: 'Is a low score something to be proud of?',
    answer:
      'A low score reflects your current strengths in focus and self-regulation. Every profile is different: the goal is to understand yourself, not to rank yourself.'
  }
];
