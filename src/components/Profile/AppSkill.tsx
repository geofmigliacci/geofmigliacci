import { Image, Tooltip } from '@mantine/core';

interface AppSkillProps {
  label: string;
  src: string;
}

export default function AppSkill({ label, src }: AppSkillProps) {
  return (
    <Tooltip label={label} position="left">
      <Image alt={label} width={64} height={64} src={src} placeholder={label} />
    </Tooltip>
  );
}
