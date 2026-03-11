import { ComponentPropsWithoutRef } from 'react';
import { LinkProps } from 'react-router-dom';

export type TrackableElement = 'button' | 'link' | 'external-link' | 'router-link';

export interface TrackingData {
  payload?: Record<string, unknown>;
}

export type TrackedClickProps = TrackingData & {
  elementType: TrackableElement;
  href?: string;
  to?: LinkProps['to']; // For React Router
  openInNewTab?: boolean;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
} & ComponentPropsWithoutRef<'button'> &
  ComponentPropsWithoutRef<'a'> &
  Partial<LinkProps>;
