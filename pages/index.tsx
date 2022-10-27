import { Center, Container, createStyles, Text, Title } from '@mantine/core';
import { motion } from 'framer-motion';

import AppLogo from '../components/_app/AppLogo';
import AppResumeDownload from '../components/_app/AppResumeDownload';
import AppWaves from '../components/_app/AppWaves';

const useStyles = createStyles((theme) => ({
  wrapper: {
    height: `100%`,
    display: `flex`,
    justifyContent: `center`,
    flexDirection: `column`,
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
        ? theme.colors[theme.primaryColor][2]
        : theme.colors[theme.primaryColor][8],
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
      <AppWaves />
      <Container size="xl">
        <motion.div
          initial={{ x: "-50%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <AppLogo width={64}></AppLogo>
        </motion.div>

        <motion.div
          initial={{ x: "-50%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Title className={classes.title}>
            Geoffrey&nbsp;
            <Text component="span" inherit className={classes.highlight}>
              MIGLIACCI
            </Text>
          </Title>
        </motion.div>

        <motion.div
          initial={{ x: "-50%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Text size="lg" className={classes.description}>
            {`Un développeur full stack avec 4 ans d'expérience, passionné par les
          nouvelles technologies, les frameworks & la musique.`}
          </Text>
        </motion.div>

        <motion.div
          initial={{ x: "-50%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Center mt="xs">
            <AppResumeDownload />
          </Center>
        </motion.div>
      </Container>
    </div>
  );
}
