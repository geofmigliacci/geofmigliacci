import { ActionIcon, Container, createStyles, Group, Header } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { IconArchive, IconBrandGithub, IconBrandLinkedin, IconHome2, IconUserSearch } from '@tabler/icons';
import { useRouter } from 'next/router';

import AppThemeSwitch from './AppThemeSwitch';

const useStyles = createStyles((theme) => ({
  inner: {
    display: `flex`,
    justifyContent: `space-between`,
    alignItems: `center`,
    height: 56,
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  active: {
    "&, &:hover": {
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
    <NextLink
      key={link.label}
      href={link.href}
      className={cx(classes.link, {
        [classes.active]: router.pathname === link.href,
      })}
    >
      {link.icon}
    </NextLink>
  ));

  return (
    <Header height={56}>
      <Container className={classes.inner}>
        <Group spacing={2} position="left" noWrap>
          {links}
        </Group>

        <Group spacing={2} position="right" noWrap>
          <NextLink href="https://github.com/geofmigliacci" target="_blank">
            <ActionIcon size="lg">
              <IconBrandGithub size={18} stroke={1.5} />
            </ActionIcon>
          </NextLink>

          <NextLink
            href="https://www.linkedin.com/in/geofmigliacci/"
            target="_blank"
          >
            <ActionIcon size="lg">
              <IconBrandLinkedin size={18} stroke={1.5} />
            </ActionIcon>
          </NextLink>

          <AppThemeSwitch />
        </Group>
      </Container>
    </Header>
  );
}
