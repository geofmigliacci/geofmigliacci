import { Avatar, Center, createStyles, Navbar, NavLink, Stack, Tooltip } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { IconArchive, IconHome2, IconUserSearch } from '@tabler/icons';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { useState } from 'react';

import { AppLogo } from './AppLogo';
import { AppThemeSwitch } from './AppThemeSwitch';

const useStyles = createStyles((theme) => ({
    link: {
        width: 48,
        height: 48,
        borderRadius: theme.radius.md,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

    },

    active: {
        '&, &:hover': {
            backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
            color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        },
    },
}));

interface NavbarLinkProps {
    icon: ReactNode;
    label: string;
    href: string;
}

function NavbarLink({ icon, label, href }: NavbarLinkProps) {
    const router = useRouter();
    const { classes, cx } = useStyles();

    return (
        <Tooltip label={label} position="right" transitionDuration={0}>
            <NavLink component={NextLink} href={href} className={cx(classes.link, { [classes.active]: router.pathname === href })} icon={icon} label={label} />
        </Tooltip>
    );
}

const mockdata = [
    { icon: <IconHome2 stroke={1} />, label: 'Accueil', href: '/' },
    { icon: <IconUserSearch stroke={1} />, label: 'Profil', href: '/profile' },
    { icon: <IconArchive stroke={1} />, label: 'Projets', href: '/projects' },
];

export function AppAside() {
    const links = mockdata.map((link) => (
        <NavbarLink icon={link.icon} label={link.label} href={link.href} key={link.label} />
    ));

    return (
        <Navbar height='100vh' width={{ base: 80 }} p="md">
            <Center>
                <AppLogo />
            </Center>
            <Navbar.Section grow mt={32}>
                <Stack justify="center" align="center" spacing={8}>
                    {links}
                </Stack>
            </Navbar.Section>
            <Navbar.Section>
                <Stack justify="center" align="center" spacing={8}>
                    <AppThemeSwitch />
                    <Avatar size={32} src="/images/gmi.jpg" alt="Geoffrey Migliacci" />
                </Stack>
            </Navbar.Section>
        </Navbar>
    );
}