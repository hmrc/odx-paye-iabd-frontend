import { Link } from 'react-router-dom';

import { TrackedClickProps } from './types';
import useTracking from '../../helpers/hooks/useTracking';

export default function TrackedClick({
  elementType,
  payload,
  href,
  to,
  openInNewTab = false,
  onClick,
  children,
  ...props
}: TrackedClickProps) {
  const { trackEvent } = useTracking();

  const handleClick = async (e: React.MouseEvent) => {
    // Prevent default for external links
    if (elementType === 'external-link') {
      e.preventDefault();
    }

    await trackEvent({
      payload: {
        ...payload
      }
    });
    onClick(e);
  };

  // Determine which element to render
  switch (elementType) {
    case 'router-link':
      return (
        <Link to={to!} onClick={handleClick} {...props}>
          {children}
        </Link>
      );

    case 'external-link':
      return (
        <a
          href={href}
          onClick={handleClick}
          target={openInNewTab ? '_blank' : '_self'}
          rel={openInNewTab ? 'noopener noreferrer' : undefined}
          {...props}
        >
          {children}
        </a>
      );

    case 'link':
      return (
        <a href={href} onClick={handleClick} {...props}>
          {children}
        </a>
      );

    case 'button':
    default:
      return (
        <button type='button' onClick={handleClick} {...props}>
          {children}
        </button>
      );
  }
}
