import React from 'react';

import { Box, BoxProps, color, space, themeColor, Button, useClipboard } from '@blockstack/ui';
import { border, onlyText } from '@common/utils';
import { css } from '@styled-system/css';
import { Text } from '@components/typography';

const LINE_MINIMUM = 4;

const getHighlightLineNumbers = (str: string): number[] | undefined => {
  if (!str) return;
  let numbers: number[] | undefined = undefined;
  numbers = str.split(',').flatMap(s => {
    if (!s.includes('-')) return +s;

    const [min, max] = s.split('-');
    // @ts-ignore
    const final = Array.from({ length: max - min + 1 }, (_, n) => n + +min);
    return final;
  });
  return numbers;
};

const generateCssStylesForHighlightedLines = (numbers: number[] = []) => {
  const record = {};
  const style = {
    bg: 'var(--colors-highlight-line-bg)',
    '&::before': {
      borderRightColor: themeColor('ink.600'),
    },
  };
  numbers.forEach(number => {
    record[`&:nth-of-type(${number})`] = style;
  });
  return record;
};

export const Code: React.FC<
  BoxProps & { highlight?: string; lang?: string; lines: number }
> = React.memo(
  React.forwardRef(({ children, highlight, lang, lines, ...rest }, ref) => {
    const { hasCopied, onCopy } = useClipboard(onlyText(children));
    const numbers = getHighlightLineNumbers(highlight);
    return (
      <Box className={lines <= 3 ? 'no-line-numbers' : ''} ref={ref as any} overflowX="auto">
        <Box
          as="code"
          css={css({
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            minWidth: 'fit-content',
            '.token-line': {
              display: 'inline-block',
              ...generateCssStylesForHighlightedLines(numbers),
            },
            counterReset: 'line',
            '& .token-line': {
              '.comment': {
                color: 'rgba(255,255,255,0.5) !important',
              },
              display: 'flex',
              fontSize: '14px',

              '&::before':
                lines > LINE_MINIMUM && lang !== 'bash'
                  ? {
                      counterIncrement: 'line',
                      content: 'counter(line, decimal-leading-zero)',
                      display: 'grid',
                      placeItems: 'center',
                      color: themeColor('ink.400'),
                      mr: '16px',
                      width: '42px',
                      fontSize: '12px',
                      borderRight: '1px solid rgb(39,41,46)',
                    }
                  : {},
            },
            pr: space(['base-loose', 'base-loose', 'extra-loose', 'extra-loose']),
            pl:
              lines <= LINE_MINIMUM || lang === 'bash'
                ? space(['extra-loose', 'extra-loose', 'base-loose', 'base-loose'])
                : 'unset',
          })}
          {...rest}
        >
          <Box height="16px" width="100%" />
          {children}
          <Box height="16px" width="100%" />
        </Box>
        <Button onClick={onCopy} size="sm" mode="secondary">
          {hasCopied ? 'Copied!' : 'Copy'}
        </Button>
      </Box>
    );
  })
);

const preProps = {
  display: 'inline-block',
  border: border(),
  borderRadius: '4px',
  padding: '2px 6px',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
  bg: color('bg'),
};

export const InlineCode: React.FC<BoxProps> = ({ children, ...rest }) => (
  <Text
    as="code"
    css={css({
      // @ts-ignore
      fontSize: '14px',
      // @ts-ignore
      lineHeight: '20px',
      ...preProps,
      ...rest,
    })}
  >
    {children}
  </Text>
);
