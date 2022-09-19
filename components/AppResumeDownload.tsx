import { ActionIcon, Tooltip } from '@mantine/core';
import { IconFileDownload } from '@tabler/icons';
import React from 'react';

export default function AppResumeDownload() {
  return (
    <Tooltip label="Cliquez ici pour télécharger mon CV" position="bottom">
      <ActionIcon
        href="/files/Migliacci Geoffrey - CV.pdf"
        component="a"
        target="_blank"
        download="Migliacci Geoffrey - CV.pdf"
        rel="noopener noreferrer"
      >
        <IconFileDownload size={32} stroke={1.5} />
      </ActionIcon>
    </Tooltip>
  );
}
