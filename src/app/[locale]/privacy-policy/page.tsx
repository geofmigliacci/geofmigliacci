import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/json-ld";
import { Separator } from "@/components/ui/separator";
import { type Locale, localePath } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { breadcrumbJsonLd, graph } from "@/lib/json-ld";
import { alternatesFor, openGraphBase } from "@/lib/metadata";
import { contactEmail, host, person } from "@/lib/site";
import { THEME_STORAGE_KEY } from "@/lib/theme";

interface LocaleParams {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Politique de confidentialité",
    description:
      "Ce site n'utilise ni mesure d'audience, ni traceur, ni cookie publicitaire. Détail de ce qui est stocké et de vos droits.",
    alternates: alternatesFor("/privacy-policy", locale),
    openGraph: {
      ...openGraphBase(locale),
      type: "website",
      url: localePath(locale, "/privacy-policy"),
    },
  };
}

const LAST_UPDATED = "3 août 2026";

export default async function PrivacyPolicyPage({ params }: LocaleParams) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="page-shell">
      <JsonLd
        data={graph(breadcrumbJsonLd({ locale, path: "/privacy-policy" }))}
      />
      <div className="enter-rise">
        <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
          Politique de confidentialité
        </h1>
        <p className="mt-4 font-mono text-xs text-muted-foreground">
          Dernière mise à jour : {LAST_UPDATED}
        </p>

        <Separator className="my-8" />

        <div className="prose prose-zinc max-w-none dark:prose-invert">
          <h2>En résumé</h2>
          <p>
            Ce site ne mesure pas son audience, ne profile personne et ne vend
            rien. Il n'embarque aucun script tiers, aucun outil d'analyse et
            aucune régie publicitaire. Il n'y a donc pas de bandeau de
            consentement à afficher, faute de traceur à faire accepter.
          </p>

          <h2>Ce qui est stocké dans votre navigateur</h2>
          <p>
            Une seule valeur, sous la clé <code>{THEME_STORAGE_KEY}</code>, est
            enregistrée dans le stockage local de votre navigateur, et
            uniquement si vous basculez entre le thème clair et le thème sombre.
            Elle vaut <code>light</code> ou <code>dark</code>, rien d'autre.
          </p>
          <p>
            Cette valeur ne quitte jamais votre navigateur : elle n'est
            transmise à aucun serveur. Vous pouvez la supprimer à tout moment en
            effaçant les données de site depuis les réglages de votre
            navigateur.
          </p>
          <p>
            Aucun cookie n'est déposé. Ce stockage étant strictement nécessaire
            à un service que vous avez demandé, à savoir mémoriser une
            préférence d'affichage, il ne relève pas du consentement préalable
            au sens des lignes directrices de la CNIL.
          </p>

          <h2>Journaux de l'hébergeur</h2>
          <p>
            Le site est hébergé par {host.name}, qui agit comme sous-traitant au
            sens du RGPD. Comme tout hébergeur, {host.name} enregistre
            techniquement les requêtes reçues : adresse IP, date et heure, page
            demandée, type de navigateur. Ces journaux servent à fournir le
            service, à le sécuriser et à diagnostiquer les pannes. Ce traitement
            repose sur l'intérêt légitime à faire fonctionner un site accessible
            et sûr.
          </p>
          <p>
            Je ne consulte pas ces journaux, n'en conserve aucune copie et n'en
            tire aucune statistique. Leur durée de conservation est déterminée
            par l'hébergeur seul, selon les règles décrites dans sa{" "}
            <a href={host.privacyUrl} target="_blank" rel="noreferrer">
              politique de confidentialité
            </a>
            .
          </p>
          <p>
            {host.name} étant établie aux États-Unis, un transfert de données
            hors de l'Union européenne intervient. Il est encadré par les
            clauses contractuelles types de la Commission européenne, ainsi que
            par la certification de {host.name} au titre du cadre de protection
            des données UE/États-Unis (EU-US Data Privacy Framework).
          </p>

          <h2>Si vous m'écrivez</h2>
          <p>
            Il n'y a pas de formulaire sur ce site. Si vous m'écrivez à{" "}
            <a href={person.email}>{contactEmail}</a>, votre adresse et le
            contenu de votre message sont utilisés uniquement pour vous
            répondre, et restent dans ma messagerie. Ils ne sont ni transmis, ni
            réutilisés à d'autres fins.
          </p>

          <h2>Vos droits</h2>
          <p>
            Le règlement général sur la protection des données vous ouvre un
            droit d'accès, de rectification, d'effacement, de limitation,
            d'opposition et de portabilité sur vos données. Pour l'exercer,
            écrivez à <a href={person.email}>{contactEmail}</a>.
          </p>
          <p>
            Si une réponse ne vous satisfait pas, vous pouvez saisir la
            Commission nationale de l'informatique et des libertés :{" "}
            <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">
              www.cnil.fr
            </a>
            .
          </p>

          <h2>Responsable du traitement</h2>
          <p>
            Le responsable du traitement est {person.name}, joignable à{" "}
            <a href={person.email}>{contactEmail}</a>. Le seul sous-traitant est{" "}
            {host.name}, au titre de l'hébergement décrit plus haut. Aucune
            donnée n'est transmise à d'autres destinataires. Les informations
            d'édition figurent dans les{" "}
            <Link href="/legal">mentions légales</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
