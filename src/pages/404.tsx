import { Container, createStyles, Text, Title } from '@mantine/core';

const useStyles = createStyles((theme) => ({
    wrapper: {
        height: '100%',
        display: 'flex',
        alignItems: 'center'
    },

    label: {
        textAlign: 'center',
        fontWeight: 900,
        fontSize: 220,
        lineHeight: 1,
        marginBottom: theme.spacing.xl * 1.5,
        color: theme.colorScheme === 'dark' ? theme.colors.arancia[2] : theme.colors.arancia[8],

        [theme.fn.smallerThan('sm')]: {
            fontSize: 120,
        },
    },

    title: {
        textAlign: 'center',
        fontWeight: 900,
        fontSize: 38,

        [theme.fn.smallerThan('sm')]: {
            fontSize: 32,
        },
    },

    description: {
        margin: 'auto',
        marginTop: theme.spacing.xl,
    },
}));

export default function NotFoundTitle() {
    const { classes } = useStyles();

    return (
        <div className={classes.wrapper}>
            <Container>
                <div className={classes.label}>404</div>
                <Title className={classes.title}>Vous avez trouvé un endroit secret.</Title>
                <Text color="dimmed" size="lg" align="center" className={classes.description}>
                    Malheureusement, il s'agit uniquement d'une page 404. Vous avez peut-être fait une erreur de frappe dans l'adresse, ou la page a été déplacée vers une autre URL.
                </Text>
            </Container>
        </div>
    );
}
