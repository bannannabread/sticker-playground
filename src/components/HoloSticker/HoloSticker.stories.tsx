/* src/components/HoloSticker/HoloSticker.stories.tsx */
import type { Meta, StoryObj } from '@storybook/react';
import { HoloSticker } from './HoloSticker';

const meta = {
  title: 'Components/HoloSticker',
  component: HoloSticker,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1A1A2E' },
        { name: 'light', value: '#F5F0E8' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    stickerType: {
      control: 'select',
      options: ['graphic', 'label', 'badge'],
    },
    colorTheme: {
      control: 'select',
      options: ['yellow', 'pink', 'blue', 'purple', 'cream', 'ink'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  decorators: [
    (Story) => (
      <div className="p-12 rounded-2xl border border-white/5 bg-slate-950/40 backdrop-blur-md flex items-center justify-center min-w-[300px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HoloSticker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    stickerType: 'graphic',
    colorTheme: 'yellow',
    size: 'md',
    title: 'Frank Monkey',
    badgeText: 'ORIGINAL',
  },
};

export const GraphicMonkey: Story = {
  args: {
    stickerType: 'graphic',
    colorTheme: 'pink',
    size: 'md',
    title: 'MONKEY DUST',
    badgeText: 'PORTFOLIO',
  },
};

export const RetroLabel: Story = {
  args: {
    stickerType: 'label',
    colorTheme: 'blue',
    size: 'md',
    title: 'CSS TILT',
    subtitle: '100% GPU / ZERO WEBGL',
  },
};

export const HoloBadge: Story = {
  args: {
    stickerType: 'badge',
    colorTheme: 'purple',
    size: 'md',
    title: 'FIGMA TO CODE',
  },
};

export const InkSticker: Story = {
  args: {
    stickerType: 'label',
    colorTheme: 'ink',
    size: 'md',
    title: 'STREET STYLE',
    subtitle: 'METALLIC SHINE',
  },
};
