import { AppProjectCard } from '@/components/Projects/AppProjectCard';
import { AppProjectsStats } from '@/components/Projects/AppProjectsStats';
import { Repository } from '@/types/repository.interface';
import { Container, createStyles, Grid, SimpleGrid, Skeleton } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';

const useStyles = createStyles((theme) => ({
  title: {
    fontWeight: 900,
    color: theme.colorScheme === 'dark' ? theme.colors.arancia[2] : theme.colors.arancia[8],

    [theme.fn.smallerThan('sm')]: {
      fontSize: 32,
    },
  },

  experience: {
    fontWeight: 900,
    marginTop: theme.spacing.xs,
    fontSize: 24,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 22,
    },
  },
}));

const getRepos = async (): Promise<Repository[]> => await (await (await fetch('https://api.github.com/users/geofmigliacci/repos')).json());
const getRepoLanguage = async (repoName: string): Promise<Record<string, number>> => await (await (await fetch(`https://api.github.com/repos/geofmigliacci/${repoName}/languages`)).json());

export default function ProjectsPage() {
  const { data: repositories, isLoading } = useQuery(
    ['projects'],
    getRepos,
  );

  if (isLoading) {
    return (
      <Container size="xl">
        <Grid grow gutter="md">
          <Grid.Col span={12}>
            <Skeleton height={170} />
          </Grid.Col>
          <Grid.Col span={12}>
            <SimpleGrid cols={4}>
              {Array(16).fill(1).map((el, i) =>
                <Skeleton key={i} height={450} />
              )}
            </SimpleGrid>
          </Grid.Col>
        </Grid>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Grid grow gutter="md">
        <Grid.Col span={12}>
          <AppProjectsStats repositories={repositories} />
        </Grid.Col>
        <Grid.Col span={12}>
          <SimpleGrid cols={4} breakpoints={[
            { maxWidth: 'md', cols: 3, spacing: 'md' },
            { maxWidth: 'sm', cols: 2, spacing: 'sm' },
            { maxWidth: 'xs', cols: 1, spacing: 'sm' },
          ]}>
            {
              repositories?.map((repository) => {
                return <AppProjectCard
                  key={repository.id}
                  repository={repository}
                />
              })
            }
          </SimpleGrid>
        </Grid.Col>
      </Grid>
    </Container>
  );
}