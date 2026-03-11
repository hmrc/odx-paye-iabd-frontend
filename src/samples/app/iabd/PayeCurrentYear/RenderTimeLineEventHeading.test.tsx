import React from 'react';
import { render } from '@testing-library/react';
import RenderTimeLineEventHeading from './RenderTimeLineEventHeading';

describe('RenderTimeLineEventHeading', () => {
  test('renders h3 when isShortEvent is true', () => {
    const { getByText } = render(
      <RenderTimeLineEventHeading isShortEvent>Short Event</RenderTimeLineEventHeading>
    );
    const heading = getByText('Short Event');
    expect(heading.tagName).toBe('H3');
    expect(heading).toHaveClass('hmrc-timeline__event-title');
  });

  test('renders h2 when isShortEvent is false', () => {
    const { getByText } = render(
      <RenderTimeLineEventHeading isShortEvent={false}>Long Event</RenderTimeLineEventHeading>
    );
    const heading = getByText('Long Event');
    expect(heading.tagName).toBe('H2');
    expect(heading).toHaveClass('hmrc-timeline__event-title');
  });

  test('renders children correctly', () => {
    const { getByText } = render(
      <RenderTimeLineEventHeading isShortEvent>Event Content</RenderTimeLineEventHeading>
    );
    expect(getByText('Event Content')).toBeInTheDocument();
  });
});
