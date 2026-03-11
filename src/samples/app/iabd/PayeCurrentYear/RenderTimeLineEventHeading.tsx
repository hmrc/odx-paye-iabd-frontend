import React, { ReactNode } from 'react';

interface RenderTimeLineEventHeadingProps {
  isShortEvent: boolean;
  children: ReactNode;
}

const RenderTimeLineEventHeading: React.FC<RenderTimeLineEventHeadingProps> = ({
  isShortEvent,
  children
}) => {
  const HeadingTag = isShortEvent ? 'h3' : 'h2';
  return <HeadingTag className='hmrc-timeline__event-title'>{children}</HeadingTag>;
};

export default RenderTimeLineEventHeading;
