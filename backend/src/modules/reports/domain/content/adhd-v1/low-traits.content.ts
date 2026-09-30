import type { ReportContent } from '../../interfaces/report-content.interface';
import { LOW_TRAITS_FAQ } from './faq.content';

const LEVEL_LABEL = 'Low ADHD Traits';

export const LOW_TRAITS_MALE: ReportContent = {
  levelLabel: LEVEL_LABEL,
  understanding: [
    'Your score suggests minimal ADHD traits. You show a strong ability to focus, stay organized, and manage daily responsibilities. In men, ADHD traits may more often appear through difficulties with attention, impulsivity, or restlessness. Your results suggest these challenges are unlikely to significantly affect your daily functioning.'
  ],
  strengths: {
    intro: null,
    items: [
      'Strong ability to sustain attention and complete tasks',
      'Good impulse control and measured decision-making',
      'Consistent and reliable in personal and professional responsibilities',
      'Effective time management and organizational skills'
    ]
  },
  emotional: {
    intro:
      'Your low ADHD trait score suggests strong emotional regulation and impulse control in most situations. Men may sometimes experience ADHD-related challenges through impulsivity, restlessness, or difficulty managing frustration. Your results indicate that you generally maintain control and manage unexpected situations effectively.',
    bullets: [],
    closing: null
  },
  faq: LOW_TRAITS_FAQ
};

export const LOW_TRAITS_FEMALE: ReportContent = {
  levelLabel: LEVEL_LABEL,
  understanding: [
    'Your score suggests minimal ADHD traits. You show a strong ability to focus, stay organized, and manage daily responsibilities. For women, ADHD traits can sometimes appear more subtly through difficulties with attention, mental organization, or managing multiple demands. Your results suggest these challenges are unlikely to significantly affect your daily functioning.'
  ],
  strengths: {
    intro: null,
    items: [
      'Strong ability to sustain attention and complete tasks',
      'Effective organization and management of daily responsibilities',
      'Consistent and reliable in personal and professional settings',
      'Good self-regulation and thoughtful decision-making'
    ]
  },
  emotional: {
    intro:
      'Your low ADHD trait score suggests strong emotional regulation in most situations. Women may sometimes experience ADHD-related challenges through emotional overwhelm or difficulty managing competing demands. Your results indicate that you generally handle stress, frustration, and unexpected changes effectively.',
    bullets: [],
    closing: null
  },
  faq: LOW_TRAITS_FAQ
};
