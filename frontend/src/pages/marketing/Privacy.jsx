import LegalLayout, { LegalSection } from '../../components/landing/LegalLayout'

/* Politique de confidentialité. */
export default function Privacy() {
  return (
    <LegalLayout title="Politique de confidentialité" updated="6 octobre 2026">
      <LegalSection number={1} heading="Qui sommes-nous ?">
        <p>
          StockPro est une application de gestion de stock éditée par l'équipe StockPro, basée à
          Porto-Novo (Bénin). La présente politique décrit quelles données nous collectons,
          pourquoi, et les droits dont vous disposez.
        </p>
        <p>
          Pour toute question relative à vos données, écrivez-nous à{' '}
          <a className="text-brand font-semibold" href="mailto:contact@stockpro.com">
            contact@stockpro.com
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection number={2} heading="Données que nous collectons">
        <p>Nous collectons uniquement les données nécessaires au fonctionnement du service :</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <b>Données de compte</b> : nom, adresse e-mail et mot de passe (chiffré). Dans le
            cadre des espaces de démonstration, aucun paiement n'est requis.
          </li>
          <li>
            <b>Données de gestion</b> : produits, catégories, fournisseurs, mouvements d'entrée et
            de sortie, inventaires et alertes de stock bas que vous saisissez.
          </li>
          <li>
            <b>Données techniques</b> : journaux de connexion, adresse IP et type d'appareil,
            utilisés pour la sécurité et la stabilité du service.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number={3} heading="Utilisation de vos données">
        <p>Vos données sont utilisées exclusivement pour :</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>vous fournir l'accès à votre espace et à ses fonctionnalités ;</li>
          <li>vous signaler les alertes de stock bas et les seuils dépassés ;</li>
          <li>assurer la sécurité, la maintenance et l'amélioration de l'application ;</li>
          <li>répondre à vos demandes de support.</li>
        </ul>
        <p>
          Nous ne vendons jamais vos données et ne les utilisons pas à des fins publicitaires.
        </p>
      </LegalSection>

      <LegalSection number={4} heading="Conservation des données">
        <p>
          Nous conservons vos données tant que votre compte est actif, puis pendant une durée
          raisonnable après sa suppression, le temps d'honorer nos obligations légales et
          comptables. Vous pouvez demander la suppression de votre compte à tout moment.
        </p>
      </LegalSection>

      <LegalSection number={5} heading="Partage des données">
        <p>
          Vos données ne sont partagées qu'avec des prestataires techniques (hébergement de la
          plateforme et de la base de données) strictement nécessaires au fonctionnement du
          service, ou lorsque la loi l'exige.
        </p>
      </LegalSection>

      <LegalSection number={6} heading="Sécurité">
        <p>
          Vos données sont stockées sur des serveurs sécurisés. Les mots de passe sont chiffrés et
          l'accès à votre espace est protégé. Nous appliquons des mesures de sécurité
          organisationnelles et techniques adaptées à la nature des données traitées.
        </p>
      </LegalSection>

      <LegalSection number={7} heading="Vos droits">
        <p>Conformément à la réglementation applicable, vous disposez des droits suivants :</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>droit d'accès et de rectification de vos données ;</li>
          <li>droit de suppression (« droit à l'oubli ») ;</li>
          <li>droit de limitation et d'opposition au traitement ;</li>
          <li>droit à la portabilité de vos données.</li>
        </ul>
        <p>
          Pour exercer ces droits, contactez-nous à{' '}
          <a className="text-brand font-semibold" href="mailto:contact@stockpro.com">
            contact@stockpro.com
          </a>
          . Nous répondons à toute demande dans un délai de trente jours.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}