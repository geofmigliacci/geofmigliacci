import { Repository } from '@/types/repository.interface';
import { Badge, Button, Card, createStyles, Group, Text } from '@mantine/core';
import { IconEye } from '@tabler/icons';
import Link from 'next/link';

const useStyles = createStyles((theme) => ({
  card: {
    display: `flex`,
    flexDirection: `column`,
    backgroundColor:
      theme.colorScheme === `dark` ? theme.colors.dark[7] : theme.white,
  },

  section: {
    borderBottom: `1px solid ${
      theme.colorScheme === `dark` ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    padding: theme.spacing.md,
  },

  label: {
    textTransform: `uppercase`,
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}));

interface AppProjectCard {
  repository: Repository;
}

export function AppProjectCard({ repository }: AppProjectCard) {
  const { classes, theme } = useStyles();

  const topics =
    repository?.topics?.map((badge) => (
      <Badge
        size="lg"
        radius="xl"
        color={theme.colorScheme === `dark` ? `dark` : `gray`}
        key={badge}
      >
        {badge}
      </Badge>
    )) ?? [];

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section className={classes.section} mt="xs">
        <Group position="apart">
          <Text size="lg" weight={500} transform="uppercase">
            {repository?.name}
          </Text>
          <Badge size="sm">{repository?.language ?? `Divers`}</Badge>
        </Group>
        <Text size="sm" mt="xs">
          {repository?.description ?? `Aucune description.`}
        </Text>
      </Card.Section>

      <Card.Section mb="md" className={classes.section}>
        <Text className={classes.label} color="dimmed">
          SUJETS
        </Text>
        <Group spacing={7} mt={5}>
          {topics}
        </Group>
      </Card.Section>

      <Group mt="auto">
        <Link href={repository?.html_url ?? `https://github.com/404`} passHref>
          <Button component="a" radius="md" target="_blank" style={{ flex: 1 }}>
            <IconEye size={18} />
          </Button>
        </Link>
      </Group>
    </Card>
  );
}
