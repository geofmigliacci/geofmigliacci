import { Container, createStyles, Text, Title } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  wrapper: {
    height: `100%`,
    display: `flex`,
    alignItems: `center`,
  },

  title: {
    fontWeight: 800,
    fontSize: 40,
    letterSpacing: -1,
    marginBottom: theme.spacing.xs,
    textAlign: `left`,

    [theme.fn.smallerThan(`sm`)]: {
      fontSize: 36,
    },
  },

  highlight: {
    color:
      theme.colorScheme === `dark`
        ? theme.colors.arancia[2]
        : theme.colors.arancia[8],
  },

  description: {
    textAlign: `left`,

    [theme.fn.smallerThan(`sm`)]: {
      fontSize: theme.fontSizes.md,
    },
  },
}));

export default function HomePage() {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <Container size="xl">
        <Title className={classes.title}>
          Geoffrey&nbsp;
          <Text component="span" inherit className={classes.highlight}>
            MIGLIACCI
          </Text>
        </Title>

        <Text size="lg" className={classes.description}>
          {`Un développeur full stack avec 4 ans d'expérience, passionné par les
          nouvelles technologies, les frameworks et la guitare.`}
        </Text>
      </Container>
    </div>
  );
}
