import { useMantineTheme } from '@mantine/core';
import React from 'react';

export function AppLogo() {
  const theme = useMantineTheme();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="100%"
      width="33"
      viewBox="0 0 490 490"
    >
      <path
        fill={
          theme.colorScheme === `dark`
            ? theme.colors.arancia[2]
            : theme.colors.arancia[8]
        }
        d="M23.968 122.5v245L245 490l221.032-122.5v-245L245 0 23.968 122.5zM331.3 292.828L245 340.656l-86.3-47.828V197.17l86.3-47.828 86.3 47.828v95.657z"
      />
    </svg>
  );
}
