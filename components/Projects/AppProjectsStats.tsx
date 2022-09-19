import { createStyles, Text } from '@mantine/core';

import { Repository } from '../../types/repository.interface';

const useStyles = createStyles((theme) => ({
  root: {
    display: `flex`,
    backgroundImage: `linear-gradient(-60deg, ${
      theme.colorScheme === `dark`
        ? theme.colors.arancia[2]
        : theme.colors.arancia[8]
    } 0%, ${theme.colors[theme.primaryColor][7]} 100%)`,
    padding: theme.spacing.xl * 1.5,
    borderRadius: theme.radius.md,

    [theme.fn.smallerThan(`sm`)]: {
      flexDirection: `column`,
    },
  },

  title: {
    color: theme.white,
    textTransform: `uppercase`,
    fontWeight: 700,
    fontSize: theme.fontSizes.sm,
  },

  count: {
    color: theme.white,
    fontSize: 32,
    lineHeight: 1,
    fontWeight: 700,
    marginBottom: theme.spacing.md,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  stat: {
    flex: 1,

    '& + &': {
      paddingLeft: theme.spacing.xl,
      marginLeft: theme.spacing.xl,
      borderLeft: `1px solid ${theme.colors[theme.primaryColor][3]}`,

      [theme.fn.smallerThan(`sm`)]: {
        paddingLeft: 0,
        marginLeft: 0,
        borderLeft: 0,
        paddingTop: theme.spacing.xl,
        marginTop: theme.spacing.xl,
        borderTop: `1px solid ${theme.colors[theme.primaryColor][3]}`,
      },
    },
  },
}));

interface AppProjectsStatsProps {
  repositories?: Repository[];
}

export default function AppProjectsStats({ repositories }: AppProjectsStatsProps) {
  const { classes } = useStyles();

  const totalRepos = repositories?.length;
  const totalLines = repositories?.reduce(
    (accumulator: number, previousValue: Repository) => {
      accumulator += previousValue.size || 0;
      return accumulator;
    },
    0,
  );

  return (
    <div className={classes.root}>
      <div className={classes.stat}>
        <Text className={classes.count}>{totalRepos} dépôts</Text>
        <Text className={classes.title}>Nombre de dépôts totals</Text>
      </div>
      <div className={classes.stat}>
        <Text className={classes.count}>{totalLines} lignes</Text>
        <Text className={classes.title}>Nombre de lignes totales</Text>
      </div>
    </div>
  );
}
