import type { ReportContent } from '../../interfaces/report-content.interface';
import { HIGH_TRAITS_FAQ } from './faq.content';

const LEVEL_LABEL = 'High ADHD Traits';
const STRENGTHS_INTRO = 'Despite these challenges, you possess real strengths:';

export const HIGH_TRAITS_MALE: ReportContent = {
  levelLabel: LEVEL_LABEL,
  understanding: [
    'Your score suggests that you exhibit high ADHD traits, meaning that difficulties with attention, impulse control, restlessness, and executive functioning may significantly affect daily life. In men, ADHD traits may be more noticeable through difficulties with impulsivity, maintaining focus, managing restlessness, or staying consistent with everyday tasks. At the same time, many men develop effective coping strategies that help them manage these challenges while drawing on their energy, creativity, and adaptability.'
  ],
  strengths: {
    intro: STRENGTHS_INTRO,
    items: [
      'Strong creative problem-solving and ability to adapt quickly',
      'Ability to think outside the box and find unconventional solutions',
      'High energy and enthusiasm when engaged in areas of interest',
      'Resilience and persistence when facing setbacks',
      'Ability to hyperfocus on activities that capture your interest'
    ]
  },
  emotional: {
    intro:
      'Your high ADHD traits may influence your emotional responses and impulse control. Men with ADHD may sometimes experience greater difficulty with impulsivity, restlessness, or managing frustration. You may:',
    bullets: [
      'React quickly or impulsively when emotions run high',
      'Struggle with frustration and impatience in stressful situations',
      'Feel restless or find it difficult to stay engaged with tasks that feel repetitive',
      'Find it challenging to pause before interrupting conversations or making decisions'
    ],
    closing:
      'While impulse control can be challenging, developing self-awareness, structured routines, and practical coping strategies can help improve emotional regulation and everyday decision-making.'
  },
  faq: HIGH_TRAITS_FAQ
};

export const HIGH_TRAITS_FEMALE: ReportContent = {
  levelLabel: LEVEL_LABEL,
  understanding: [
    'Your score suggests that you exhibit high ADHD traits, meaning that difficulties with attention, organization, emotional regulation, and managing competing demands may significantly affect daily life. In women, ADHD can sometimes be less outwardly noticeable and may involve difficulties with staying organized, managing mental load, maintaining focus, or keeping up with multiple responsibilities. At the same time, many women develop strong coping strategies that help them compensate for these challenges while drawing on their creativity, adaptability, and resilience.'
  ],
  strengths: {
    intro: STRENGTHS_INTRO,
    items: [
      'Strong creative problem-solving and ability to adapt to changing situations',
      'Ability to see connections and possibilities others may overlook',
      'High enthusiasm and energy when engaged in meaningful activities',
      'Resilience and determination when facing setbacks',
      'Ability to hyperfocus on areas of strong interest when properly channeled'
    ]
  },
  emotional: {
    intro:
      'Your high ADHD traits may influence how you experience and manage emotions. Women with ADHD may sometimes experience stronger emotional responses, mental overwhelm, or difficulty balancing multiple demands. You may:',
    bullets: [
      'Experience intense emotions or become emotionally overwhelmed more easily',
      'Struggle with frustration when responsibilities or plans become difficult to manage',
      'Feel particularly affected by unexpected changes or setbacks',
      'Find it challenging to shift attention away from thoughts, tasks, or situations that feel emotionally significant'
    ],
    closing:
      'While emotional regulation can be challenging, developing self-awareness, supportive routines, and practical coping strategies can help create greater emotional stability.'
  },
  faq: HIGH_TRAITS_FAQ
};
