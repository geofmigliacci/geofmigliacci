import { Avatar, createStyles, Group, Text } from '@mantine/core';
import { IconAt, IconPhoneCall } from '@tabler/icons';

const useStyles = createStyles((theme) => ({
  icon: {
    color:
      theme.colorScheme === `dark`
        ? theme.colors.dark[3]
        : theme.colors.gray[5],
  },

  name: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

interface AppAppProfileProps {
  avatar: string;
  name: string;
  title: string;
  phone: string;
  email: string;
}

export default function AppProfile({
  avatar,
  name,
  title,
  phone,
  email,
}: AppAppProfileProps) {
  const { classes } = useStyles();

  return (
    <div>
      <Group noWrap>
        <Avatar src={avatar} size={126} radius="md" />
        <div>
          <Text
            size="xs"
            sx={{ textTransform: `uppercase` }}
            weight={700}
            color="dimmed"
          >
            {title}
          </Text>

          <Text size="lg" weight={500} className={classes.name}>
            {name}
          </Text>

          <Group noWrap spacing={10} mt={3}>
            <IconAt stroke={1.5} size={16} className={classes.icon} />
            <Text size="xs" color="dimmed">
              {email}
            </Text>
          </Group>

          <Group noWrap spacing={10} mt={5}>
            <IconPhoneCall stroke={1.5} size={16} className={classes.icon} />
            <Text size="xs" color="dimmed">
              {phone}
            </Text>
          </Group>
        </div>
      </Group>
    </div>
  );
}
