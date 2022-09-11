import { ProfileInfos } from '@/components/Profile/ProfileInfos';
import {
  Avatar,
  Badge,
  Container,
  createStyles,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  Timeline,
  Title,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';

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
      <Grid grow gutter="md">
        <Grid.Col span={4}>
          <ProfileInfos
            avatar="/images/gmi.jpg"
            name="Geoffrey MIGLIACCI"
            title="ANALYSTE DÉVELOPPEUR"
            phone="+33618514026"
            email="geoffrey.migliacci@gmail.com"
          />
          <Title mt="xl" className={classes.title}>
            COMPÉTENCES
          </Title>
          <Title className={classes.experience}>FRAMEWORKS</Title>
          <Group mt="md" spacing="xs">
            <Tooltip label="NestJs" position="left">
              <Image
                alt="NestJs"
                width={64}
                height={64}
                src="images/logos/nestjs.svg"
                placeholder="NestJs"
              />
            </Tooltip>

            <Tooltip label="Angular" position="left">
              <Image
                alt="Angular"
                width={64}
                height={64}
                src="images/logos/angular.svg"
                placeholder="Angular"
              />
            </Tooltip>

            <Tooltip label="VueJs" position="left">
              <Image
                alt="VueJs"
                width={64}
                height={64}
                src="images/logos/vuejs.svg"
                placeholder="VueJs"
              />
            </Tooltip>

            <Tooltip label="NextJs" position="left">
              <Image
                alt="NextJs"
                width={64}
                height={64}
                src="images/logos/nextjs.svg"
                placeholder="NextJs"
              />
            </Tooltip>

            <Tooltip label=".NET" position="left">
              <Image
                alt=".NET"
                width={64}
                height={64}
                src="images/logos/netcore.svg"
                placeholder=".NET"
              />
            </Tooltip>

            <Tooltip label="jQuery" position="left">
              <Image
                alt="jQuery"
                width={64}
                height={64}
                src="images/logos/jquery.svg"
                placeholder="jQuery"
              />
            </Tooltip>

            <Tooltip label="Bootstrap" position="left">
              <Image
                alt="Bootstrap"
                width={64}
                height={64}
                src="images/logos/bootstrap.svg"
                placeholder="Bootstrap"
              />
            </Tooltip>
          </Group>

          <Title className={classes.experience}>LANGUAGES</Title>
          <Group mt="md" spacing="xs">
            <Tooltip label="Typescript" position="left">
              <Image
                alt="Typescript"
                width={64}
                height={64}
                src="images/logos/typescript.svg"
                placeholder="Typescript"
              />
            </Tooltip>

            <Tooltip label="JavaScript" position="left">
              <Image
                alt="JavaScript"
                width={64}
                height={64}
                src="images/logos/javascript.svg"
                placeholder="JavaScript"
              />
            </Tooltip>

            <Tooltip label="C#" position="left">
              <Image
                alt="C#"
                width={64}
                height={64}
                src="images/logos/csharp.svg"
                placeholder="C#"
              />
            </Tooltip>

            <Tooltip label="HTML5" position="left">
              <Image
                alt="HTML5"
                width={64}
                height={64}
                src="images/logos/html.svg"
                placeholder="HTML5"
              />
            </Tooltip>

            <Tooltip label="CSS" position="left">
              <Image
                alt="CSS"
                width={64}
                height={64}
                src="images/logos/css.svg"
                placeholder="CSS"
              />
            </Tooltip>

            <Tooltip label="SASS" position="left">
              <Image
                alt="SASS"
                width={64}
                height={64}
                src="images/logos/sass.svg"
                placeholder="SASS"
              />
            </Tooltip>

            <Tooltip label="PHP" position="left">
              <Image
                alt="PHP"
                width={64}
                height={64}
                src="images/logos/php.svg"
                placeholder="PHP"
              />
            </Tooltip>

            <Tooltip label="MSSQL" position="left">
              <Image
                alt="MSSQL"
                width={64}
                height={64}
                src="images/logos/mssql.svg"
                placeholder="MSSQL"
              />
            </Tooltip>

            <Tooltip label="MySQL" position="left">
              <Image
                alt="MySQL"
                width={64}
                height={64}
                src="images/logos/mysql.svg"
                placeholder="MySQL"
              />
            </Tooltip>

            <Tooltip label="PostgreSQL" position="left">
              <Image
                alt="PostgreSQL"
                width={64}
                height={64}
                src="images/logos/postgresql.svg"
                placeholder="PostgreSQL"
              />
            </Tooltip>
          </Group>

          <Title className={classes.experience}>LANGUES</Title>
          <Stack mt="md" spacing="xs" align="flex-start">
            <Badge
              sx={{ paddingLeft: 0 }}
              size="lg"
              radius="xl"
              leftSection={
                <Avatar alt="Français" size={32} src="images/flags/fr.svg" />
              }
            >
              Français (bilingue ou langue natale)
            </Badge>

            <Badge
              sx={{ paddingLeft: 0 }}
              size="lg"
              radius="xl"
              leftSection={
                <Avatar alt="Anglais" size={32} src="images/flags/gb.svg" />
              }
            >
              Anglais (compétence professionnelle)
            </Badge>

            <Badge
              sx={{ paddingLeft: 0 }}
              size="lg"
              radius="xl"
              leftSection={
                <Avatar
                  alt="Italien"
                  size={32}
                  mr={5}
                  src="images/flags/it.svg"
                />
              }
            >
              Italien (compétence professionnelle limitée)
            </Badge>
          </Stack>
        </Grid.Col>
        <Grid.Col span={8}>
          <Title className={classes.title}>PROFIL</Title>
          <Text size="md">
            {`4 ans d'expérience dans le développement de solutions informatiques,
            du front-end, au back-end en passant par l'architecture afin de
            fournir une solution rapide, fiable et durable.`}
          </Text>

          <Title mt="md" className={classes.title}>
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
            mt="xl"
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
                un front VueJs & un back Laravel en REST conteneurisé via
                Docker.`}
              </Text>
              <Text size="md" mt="xs">
                {`Mise en place de services logistiques de synchronisation de
                données entre plusieurs types de sources données via plusieurs
                micro-services en NestJs & RabbitMq en tant que message broker.`}
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
                {`Maintenance évolutive et corrective d'une application de gestion
                de demandes interopérables le tout sur le fournisseur cloud
                Azure.`}
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
                et la mise en place d'un site sous Angular.`}
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

          <Title mt="md" className={classes.title}>
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
            mt="xl"
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
