import { ActionIcon, Avatar, createStyles, Group, Stack, Text } from '@mantine/core';
import { IconFileDownload } from '@tabler/icons';
import Link from 'next/link';

const useStyles = createStyles((theme) => ({
  icon: {
    color:
      theme.colorScheme === `dark`
        ? theme.colors.dark[3]
        : theme.colors.gray[5],
  },

  name: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textTransform: `uppercase`,
  },
}));

interface AppCertification {
  name: string;
  src: string;
}

interface AppCertificationProps {
  topic: string;
  src: string;
  certifications?: AppCertification[];
}

export default function AppCertification({
  topic,
  src,
  certifications,
}: AppCertificationProps) {
  const { classes } = useStyles();

  if (!certifications?.length) {
    certifications = [];
  }

  return (
    <div>
      <Group noWrap>
        <Avatar src={src} size={40} radius="md" />
        <div>
          <Text size="lg" weight={500} className={classes.name}>
            {topic}
          </Text>

          <Stack spacing={0}>
            {certifications.map((certification) => (
              <Group spacing="xs">
                <Link href={certification.src} passHref>
                  <ActionIcon
                    component="a"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconFileDownload
                      stroke={1.5}
                      size={16}
                      className={classes.icon}
                    />
                  </ActionIcon>
                </Link>
                <Text size="md" color="dimmed">
                  {certification.name}
                </Text>
              </Group>
            ))}
          </Stack>
        </div>
      </Group>
    </div>
  );
}
