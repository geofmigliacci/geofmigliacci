import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/json-ld";
import { Separator } from "@/components/ui/separator";
import { type Locale, localePath } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { breadcrumbJsonLd, graph } from "@/lib/json-ld";
import { alternatesFor, openGraphBase } from "@/lib/metadata";
import { contactEmail, host, person, repoUrl } from "@/lib/site";

interface LocaleParams {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Mentions légales",
    description:
      "Éditeur, hébergeur, propriété intellectuelle et responsabilité pour le site geofmigliacci.dev.",
    alternates: alternatesFor("/legal", locale),
    openGraph: {
      ...openGraphBase(locale),
      type: "website",
      url: localePath(locale, "/legal"),
    },
  };
}

const LAST_UPDATED = "6 août 2026";

export default async function LegalPage({ params }: LocaleParams) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="page-shell">
      <JsonLd data={graph(breadcrumbJsonLd({ locale, path: "/legal" }))} />
      <div className="enter-rise">
        <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
          Mentions légales
        </h1>
        <p className="mt-4 font-mono text-xs text-muted-foreground">
          Dernière mise à jour : {LAST_UPDATED}
        </p>

        <Separator className="my-8" />

        {/* Base `prose`, not the posts' `prose-lg`: reference text you
            consult is not editorial text you read. */}
        <div className="prose prose-zinc max-w-none dark:prose-invert">
          <h2>Éditeur du site</h2>
          <p>
            {person.name}, particulier. Ce site est un site personnel, sans
            activité commerciale et sans publicité.
          </p>
          <p>
            Directeur de la publication : {person.name}
            <br />
            Contact : <a href={person.email}>{contactEmail}</a>
          </p>
          <p>
            L'article 6, III, 2 de la loi pour la confiance dans l'économie
            numérique autorise un éditeur non professionnel à ne diffuser
            publiquement que les coordonnées de son hébergeur, sous réserve
            d'avoir communiqué à celui-ci ses éléments d'identification
            personnelle. Je choisis de m'identifier malgré tout, et ne m'appuie
            sur cette disposition que pour ne pas publier mon adresse postale :
            celle-ci est détenue par l'hébergeur nommé ci-dessous.
          </p>

          <h2>Hébergeur</h2>
          <p>
            {host.name}
            <br />
            {host.address}
            <br />
            <a href={host.url} target="_blank" rel="noreferrer">
              {host.url}
            </a>
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            Les billets, textes, illustrations et éléments graphiques publiés
            sur ce site, logo compris, sont la propriété de {person.name}. Tous
            droits réservés.
          </p>
          <p>
            Toute reproduction ou republication, intégrale ou substantielle,
            sans accord écrit préalable est interdite. Le droit de citation
            demeure applicable : une citation courte reste autorisée, à
            condition qu'elle mentionne le nom de l'auteur et renvoie par un
            lien vers la page d'origine.
          </p>
          <p>
            Le code fait exception. Le code source du site est publié sous
            licence MIT : voir le{" "}
            <a href={repoUrl} target="_blank" rel="noreferrer">
              dépôt du site
            </a>
            .
          </p>
          <p>
            Les extraits de code publiés dans les billets sont librement
            réutilisables : copiez-les, adaptez-les, intégrez-les à un projet, y
            compris commercial, sans autorisation ni mention d'origine. Ils sont
            fournis sans garantie d'aucune sorte.
          </p>

          <h2>Responsabilité</h2>
          <p>
            Le contenu de ce site est publié à titre informatif. Malgré le soin
            apporté à sa rédaction, des erreurs ou des omissions peuvent
            subsister, et certaines informations techniques peuvent devenir
            obsolètes. L'auteur ne saurait être tenu responsable des
            conséquences d'une utilisation des informations publiées.
          </p>

          <h2>Liens externes</h2>
          <p>
            Ce site renvoie vers des sites tiers sur lesquels l'auteur n'exerce
            aucun contrôle. Leur contenu n'engage que leurs éditeurs respectifs,
            et ces liens ne valent pas approbation.
          </p>

          <h2>Données personnelles</h2>
          <p>
            Le traitement des données est décrit dans la{" "}
            <Link href="/privacy-policy">politique de confidentialité</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
