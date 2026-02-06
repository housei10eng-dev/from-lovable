import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function KPICard({ title, value, icon, trend, variant = 'default' }: KPICardProps) {
  const variantStyles = {
    default: 'from-primary/10 to-transparent',
    success: 'from-success/10 to-transparent',
    warning: 'from-warning/10 to-transparent',
    danger: 'from-destructive/10 to-transparent',
  };

  const iconBgStyles = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-glow">
      {/* Background gradient */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100',
          variantStyles[variant]
        )}
      />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          
          {trend && (
            <div className="flex items-center gap-1.5">
              {trend.value > 0 ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : trend.value < 0 ? (
                <TrendingDown className="h-4 w-4 text-destructive" />
              ) : (
                <Minus className="h-4 w-4 text-muted-foreground" />
              )}
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.value > 0 && 'text-success',
                  trend.value < 0 && 'text-destructive',
                  trend.value === 0 && 'text-muted-foreground'
                )}
              >
                {trend.value > 0 && '+'}
                {trend.value}%
              </span>
              <span className="text-sm text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>

        <div className={cn('rounded-lg p-3', iconBgStyles[variant])}>
          {icon}
        </div>
      </div>
    </div>
  );
}
