import AppCertification from '@/components/Profile/AppCertification';
import AppLanguage from '@/components/Profile/AppLanguage';
import { AppProfile } from '@/components/Profile/AppProfile';
import AppSkill from '@/components/Profile/AppSkill';
import { Container, createStyles, Grid, Group, Stack, Text, Timeline, Title, useMantineTheme } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  title: {
    fontWeight: 900,
    color:
      theme.colorScheme === `dark`
        ? theme.colors.arancia[2]
        : theme.colors.arancia[8],

    [theme.fn.smallerThan(`sm`)]: {
      fontSize: 32,
    },
  },

  experience: {
    fontWeight: 900,
    marginTop: theme.spacing.xs,
    fontSize: 24,

    [theme.fn.smallerThan(`sm`)]: {
      fontSize: 22,
    },
  },
}));

export default function ProfilePage() {
  const { classes } = useStyles();
  const theme = useMantineTheme();

  return (
    <Container size="xl">
      <Grid grow gutter="xs">
        <Grid.Col span={4}>
          <AppProfile
            avatar="/images/gmi.jpg"
            name="Geoffrey MIGLIACCI"
            title="DÉVELOPPEUR FULL STACK"
            phone="+33618514026"
            email="geoffrey.migliacci@gmail.com"
          />
          <Title mt="xs" className={classes.title}>
            COMPÉTENCES
          </Title>
          <Title className={classes.experience}>FRAMEWORKS</Title>
          <Group mt="xs" spacing="xs">
            <AppSkill label="NestJs" src="images/logos/nestjs.svg" />
            <AppSkill label="Angular" src="images/logos/angular.svg" />
            <AppSkill label="ReactJs" src="images/logos/reactjs.svg" />
            <AppSkill label="NextJs" src="images/logos/nextjs.svg" />
            <AppSkill label="VueJs" src="images/logos/vuejs.svg" />
            <AppSkill label=".NET" src="images/logos/netcore.svg" />
            <AppSkill label="Symfony" src="images/logos/symfony.svg" />
            <AppSkill label="Laravel" src="images/logos/laravel.svg" />
            <AppSkill label="Bootstrap" src="images/logos/bootstrap.svg" />
            <AppSkill label="Jest" src="images/logos/jest.svg" />
          </Group>

          <Title className={classes.experience}>LANGUAGES</Title>
          <Group mt="xs" spacing="xs">
            <AppSkill label="Typescript" src="images/logos/typescript.svg" />
            <AppSkill label="JavaScript" src="images/logos/javascript.svg" />
            <AppSkill label="C#" src="images/logos/csharp.svg" />
            <AppSkill label="HTML5" src="images/logos/html.svg" />
            <AppSkill label="CSS" src="images/logos/css.svg" />
            <AppSkill label="SASS" src="images/logos/sass.svg" />
            <AppSkill label="PHP" src="images/logos/php.svg" />
            <AppSkill label="MSSQL" src="images/logos/mssql.svg" />
            <AppSkill label="MySQL" src="images/logos/mysql.svg" />
            <AppSkill label="PostgreSQL" src="images/logos/postgresql.svg" />
          </Group>

          <Title className={classes.experience}>CERTIFICATIONS</Title>
          <Stack mt="xs" spacing="xs" align="flex-start">
            <AppCertification
              topic="NestJs"
              src="images/logos/nestjs.svg"
              certifications={[
                {
                  name: `NestJS Fundamentals`,
                  src: `https://drive.google.com/file/d/1pnj6iHQ0zoxLMQG9_QSDfA7FEg8kbI7z/view`,
                },
              ]}
            />
          </Stack>

          <Title className={classes.experience}>LANGUES</Title>
          <Stack mt="xs" spacing="xs" align="flex-start">
            <AppLanguage
              language="Français"
              level="Français (langue natale)"
              src="images/flags/fr.svg"
            />
            <AppLanguage
              language="Anglais"
              level="Anglais (C1)"
              src="images/flags/gb.svg"
            />
            <AppLanguage
              language="Italien"
              level="Italien (B1)"
              src="images/flags/it.svg"
            />
          </Stack>
        </Grid.Col>
        <Grid.Col span={8}>
          <Title className={classes.title}>PROFIL</Title>
          <Text size="md">
            {`4 ans d'expérience dans le développement de solutions informatiques,
            du front-end, au back-end en passant par l'architecture afin de
            fournir une solution rapide, fiable et durable.`}
          </Text>

          <Title mt="xs" className={classes.title}>
            EXPÉRIENCES PROFESSIONNELLES
          </Title>
          <Timeline
            color={
              theme.colorScheme === `dark`
                ? theme.colors.arancia[2]
                : theme.colors.arancia[8]
            }
            active={1}
            lineWidth={2}
            mt="xs"
          >
            <Timeline.Item
              title={
                <Title className={classes.experience}>
                  {`ANALYSTE DÉVELOPPEUR`}
                </Title>
              }
              bulletSize={24}
              lineVariant="dashed"
            >
              <Text color="dimmed" size="sm">
                {`Juin 2021 - Aujourd'hui`}
              </Text>
              <Text size="md">
                {`Maintenance évolutive et corrective d'une plateforme de
                paramétrage SaaS d'assurés dans le domaine des assurances avec
                un front VueJs & un back Laravel (MSSQL) en REST conteneurisé via
                Docker.`}
              </Text>
              <Text size="md" mt="xs">
                {`Mise en place de services logistiques de synchronisation de
                données entre plusieurs types de sources données via plusieurs
                micro-services en NestJs & RabbitMq en tant que message broker.`}
              </Text>
              <Text size="md" mt="xs">
                {`Mise en place des tests unitaires PHPUnit pour la partie métier, ainsi que les tests unitaires et E2E Jest & supertest sur les différents micro-services.`}
              </Text>
            </Timeline.Item>

            <Timeline.Item
              title={
                <Title className={classes.experience}>
                  {`INGÉNIEUR D'ÉTUDES ET DE DÉVELOPPEMENT`}
                </Title>
              }
              bulletSize={24}
            >
              <Text color="dimmed" size="sm">
                {`Octobre 2019 - Mai 2021 (1 an et 8 mois)`}
              </Text>
              <Text size="md">
                {`Maintenance et développement d'une plateforme de gestion d'application sous Angular en étant le référent. Ainsi qu'une application mobile Xamarin, en lien avec une API REST sous ASP.NET Core & MSSQL.`}
              </Text>
              <Text size="md" mt="xs">
                {`Mise en place du CI pour vérifier le linting, la configuration, la compilation ainsi que les tests unitaires Jest.`}
              </Text>
            </Timeline.Item>

            <Timeline.Item
              title={
                <Title className={classes.experience}>
                  {`STAGIAIRE DÉVELOPPEUR`}
                </Title>
              }
              bulletSize={24}
            >
              <Text color="dimmed" size="sm">
                {`Avril 2019 - Septembre 2019 (6 mois)`}
              </Text>
              <Text size="md">
                {`Maintenance évolutive et corrective d’une API REST ASP.NET Core
                avec une application Xamarin ainsi que la formation des équipes
                et la mise en place d'un site sous Angular en étant le référent.`}
              </Text>
            </Timeline.Item>

            <Timeline.Item
              title={
                <Title className={classes.experience}>
                  {`STAGIAIRE DÉVELOPPEUR`}
                </Title>
              }
              bulletSize={24}
            >
              <Text color="dimmed" size="sm">
                {`Mai 2018 - Août 2018 (4 mois)`}
              </Text>
              <Text size="md">
                {`Maintenance évolutive et corrective d'une application de gestion
                de CE avec AngularJS et Symfony.`}
              </Text>
            </Timeline.Item>

            <Timeline.Item
              title={
                <Title className={classes.experience}>
                  {`STAGIAIRE DÉVELOPPEUR`}
                </Title>
              }
              bulletSize={24}
            >
              <Text color="dimmed" size="sm">
                {`Décembre 2015 - Janvier 2016 (2 mois)`}
              </Text>
              <Text size="md">
                {`Maintenance évolutive et corrective de modules Prestashop. Ainsi
                que la mise à jour de Prestashop vers sa dernière version en
                date fluide pour les clients, sans aucun arrêt des services ou
                du site.`}
              </Text>
            </Timeline.Item>

            <Timeline.Item
              title={
                <Title className={classes.experience}>
                  {`STAGIAIRE DÉVELOPPEUR`}
                </Title>
              }
              bulletSize={24}
            >
              <Text color="dimmed" size="sm">
                {`Mai 2015 - Juin 2015 (2 mois)`}
              </Text>
              <Text size="md">
                {`Maintenance évolutive et corrective de modules Prestashop.`}
              </Text>
            </Timeline.Item>
          </Timeline>

          <Title mt="xs" className={classes.title}>
            FORMATIONS
          </Title>
          <Timeline
            color={
              theme.colorScheme === `dark`
                ? theme.colors.arancia[2]
                : theme.colors.arancia[8]
            }
            active={1}
            lineWidth={2}
            mt="xs"
          >
            <Timeline.Item
              title={
                <Title className={classes.experience}>
                  M2 DÉVELOPPEMENT & ADMINISTRATION DE SERVICES
                </Title>
              }
              bulletSize={24}
              lineVariant="dashed"
            >
              <Text color="dimmed" size="sm">
                2019
              </Text>
              <Text color="dimmed" size="sm">
                UNIVERSITÉ REIMS CHAMPAGNE-ARDENNE
              </Text>
              <Text color="dimmed" size="sm">
                MENTION BIEN
              </Text>
            </Timeline.Item>

            <Timeline.Item
              title={
                <Title className={classes.experience}>L3 INFORMATIQUE</Title>
              }
              bulletSize={24}
              lineVariant="dashed"
            >
              <Text color="dimmed" size="sm">
                2017
              </Text>
              <Text color="dimmed" size="sm">
                UNIVERSITÉ REIMS CHAMPAGNE-ARDENNE
              </Text>
              <Text color="dimmed" size="sm">
                MENTION ASSEZ BIEN
              </Text>
            </Timeline.Item>

            <Timeline.Item
              title={
                <Title className={classes.experience}>
                  BTS INFORMATIQUE OPTION SLAM
                </Title>
              }
              bulletSize={24}
              lineVariant="dashed"
            >
              <Text color="dimmed" size="sm">
                2016
              </Text>
              <Text color="dimmed" size="sm">
                LYCÉE PAUL CLAUDEL
              </Text>
            </Timeline.Item>

            <Timeline.Item
              title={<Title className={classes.experience}>BAC S</Title>}
              bulletSize={24}
              lineVariant="dashed"
            >
              <Text color="dimmed" size="sm">
                2014
              </Text>
              <Text color="dimmed" size="sm">
                LYCÉE PAUL CLAUDEL
              </Text>
            </Timeline.Item>
          </Timeline>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
