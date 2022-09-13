import {
  ActionIcon,
  Container,
  createStyles,
  Group,
  Header,
} from '@mantine/core';
import { NextLink } from '@mantine/next';
import {
  IconArchive,
  IconBrandGithub,
  IconBrandTwitter,
  IconHome2,
  IconUserSearch,
} from '@tabler/icons';
import { useRouter } from 'next/router';

import { AppLogo } from './AppLogo';
import { AppThemeSwitch } from './AppThemeSwitch';

const useStyles = createStyles((theme) => ({
  inner: {
    display: `flex`,
    justifyContent: `space-between`,
    alignItems: `center`,
    height: 56,
  },

  link: {},

  active: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({
        variant: `light`,
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: `light`, color: theme.primaryColor })
        .color,
    },
  },
}));

const mockdata = [
  { icon: <IconHome2 size={18} stroke={1.5} />, label: `Accueil`, href: `/` },
  {
    icon: <IconUserSearch size={18} stroke={1.5} />,
    label: `Profil`,
    href: `/profile`,
  },
  {
    icon: <IconArchive size={18} stroke={1.5} />,
    label: `Projets`,
    href: `/projects`,
  },
];

export function AppHeader() {
  const router = useRouter();
  const { classes, cx } = useStyles();

  const links = mockdata.map((link) => (
    <NextLink key={link.label} href={link.href}>
      <ActionIcon
        size="lg"
        className={cx(classes.link, {
          [classes.active]: router.pathname === link.href,
        })}
      >
        {link.icon}
      </ActionIcon>
    </NextLink>
  ));

  return (
    <Header height={56} mb={120}>
      <Container className={classes.inner}>
        <Group spacing={0} position="left" noWrap>
          {links}
        </Group>

        <AppLogo />

        <Group spacing={0} position="right" noWrap>
          <NextLink href="https://github.com/geofmigliacci" target="_blank">
            <ActionIcon size="lg">
              <IconBrandGithub size={18} stroke={1.5} />
            </ActionIcon>
          </NextLink>

          <NextLink href="https://twitter.com/geofmigliacci" target="_blank">
            <ActionIcon size="lg">
              <IconBrandTwitter size={18} stroke={1.5} />
            </ActionIcon>
          </NextLink>

          <AppThemeSwitch />
        </Group>
      </Container>
    </Header>
  );
}
