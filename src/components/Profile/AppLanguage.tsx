import { Avatar, Badge } from '@mantine/core';

interface AppLanguageProps {
  language: string;
  level: string;
  src: string;
}

export default function AppLanguage({
  language,
  level,
  src,
}: AppLanguageProps) {
  return (
    <Badge
      sx={{ paddingLeft: 0 }}
      size="lg"
      radius="xl"
      leftSection={<Avatar alt={language} size={32} src={src} />}
    >
      {level}
    </Badge>
  );
}
