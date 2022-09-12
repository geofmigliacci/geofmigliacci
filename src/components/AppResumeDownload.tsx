import { ActionIcon } from '@mantine/core';
import { IconFileDownload } from '@tabler/icons';
import Link from 'next/link';
import React from 'react';

export function AppResumeDownload() {
  return (
    <Link href="/files/Migliacci Geoffrey - CV.pdf" passHref>
      <ActionIcon
        component="a"
        target="_blank"
        download="Migliacci Geoffrey - CV.pdf"
        rel="noopener noreferrer"
      >
        <IconFileDownload />
      </ActionIcon>
    </Link>
  );
}
