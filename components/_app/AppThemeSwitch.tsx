import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { IconMoonStars, IconSun } from '@tabler/icons';

export default function AppThemeSwitch() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  useHotkeys([
    [
      "mod+J", () => toggleColorScheme(),
    ]
  ]);
  
  return (
    <ActionIcon
      onClick={() => toggleColorScheme()}
      size="lg"
      sx={(theme) => ({
        color:
          theme.colorScheme === `dark`
            ? theme.colors.yellow[4]
            : theme.colors.blue[6],
      })}
    >
      {colorScheme === `dark` ? (
        <IconSun size={18} stroke={1.5} />
      ) : (
        <IconMoonStars size={18} stroke={1.5} />
      )}
    </ActionIcon>
  );
}
