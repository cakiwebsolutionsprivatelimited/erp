import React from 'react';
import { formatINR } from '@/tenant/components/TenantUI';
import { cn } from '@/utils';

interface AmountDisplayProps {
  value: number;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'muted';
  className?: string;
}

const toneClass = {
  default: 'text-slate-950',
  success: 'text-emerald-700',
  warning: 'text-amber-700',
  danger: 'text-red-700',
  muted: 'text-slate-500',
};

export const AmountDisplay: React.FC<AmountDisplayProps> = ({ value, tone = 'default', className }) => (
  <span className={cn('font-semibold tabular-nums', toneClass[tone], className)}>{formatINR(value)}</span>
);
