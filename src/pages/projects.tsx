import { AppProjectCard } from '@/components/Projects/AppProjectCard';
import { AppProjectsStats } from '@/components/Projects/AppProjectsStats';
import { Repository } from '@/types/repository.interface';
import { Alert, Container, Grid, SimpleGrid, Skeleton } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons';
import { useQuery } from '@tanstack/react-query';

const getRepos = async (): Promise<Repository[]> =>
  await await (
    await fetch(`https://api.github.com/users/geofmigliacci/repos`)
  ).json();

export default function ProjectsPage() {
  const {
    data: repositories,
    isLoading,
    isError,
  } = useQuery([`projects`], getRepos);

  if (isError) {
    return (
      <Container size="xl">
        <Alert icon={<IconAlertCircle size={16} />} title="Oops !" color="red">
          {`Quelque chose de terrible est arrivé ! Les données n'ont pas pu
          arriver au port sain et sauf... Peut-être qu'en actualisant la page
          elles arriveront ?`}
        </Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container size="xl">
        <Grid grow gutter="md">
          <Grid.Col span={12}>
            <Skeleton height={170} />
          </Grid.Col>
          <Grid.Col span={12}>
            <SimpleGrid
              cols={4}
              breakpoints={[
                { maxWidth: `md`, cols: 3, spacing: `md` },
                { maxWidth: `sm`, cols: 2, spacing: `sm` },
                { maxWidth: `xs`, cols: 1, spacing: `sm` },
              ]}
            >
              {Array(8)
                .fill(1)
                .map((el, i) => (
                  <Skeleton key={i} height={350} />
                ))}
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
          <SimpleGrid
            cols={4}
            breakpoints={[
              { maxWidth: `md`, cols: 3, spacing: `md` },
              { maxWidth: `sm`, cols: 2, spacing: `sm` },
              { maxWidth: `xs`, cols: 1, spacing: `sm` },
            ]}
          >
            {repositories?.map((repository) => (
              <AppProjectCard key={repository.id} repository={repository} />
            ))}
          </SimpleGrid>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
