import LegalLayout, { LegalSection } from '../../components/landing/LegalLayout'

/* Conditions d'utilisation. */
export default function Terms() {
  return (
    <LegalLayout title="Conditions d'utilisation" updated="6 octobre 2026">
      <LegalSection number={1} heading="Acceptation des conditions">
        <p>
          En créant un compte ou en utilisant l'application StockPro, vous acceptez les présentes
          conditions d'utilisation. Si vous ne les acceptez pas, veuillez ne pas utiliser le
          service.
        </p>
      </LegalSection>

      <LegalSection number={2} heading="Description du service">
        <p>
          StockPro permet de gérer un stock : création de produits et de catégories,
          enregistrement des entrées et sorties, suivi des fournisseurs, réalisation
          d'inventaires et réception d'alertes de stock bas.
        </p>
      </LegalSection>

      <LegalSection number={3} heading="Création et usage du compte">
        <p>
          Vous vous engagez à fournir des informations exactes lors de la création de votre
          compte et à conserver la confidentialité de vos identifiants. Vous êtes responsable de
          toute activité réalisée depuis votre espace. Les espaces sont réservés aux personnes
          autorisées par votre organisation.
        </p>
      </LegalSection>

      <LegalSection number={4} heading="Utilisation responsable">
        <p>En utilisant StockPro, vous vous engagez à :</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>saisir des données licites et exactes, que vous êtes en droit de traiter ;</li>
          <li>ne pas contourner la sécurité ou tenter d'accéder à d'autres espaces ;</li>
          <li>ne pas perturber la disponibilité ou l'intégrité de la plateforme ;</li>
          <li>ne pas utiliser le service à des fins frauduleuses ou illicites.</li>
        </ul>
      </LegalSection>

      <LegalSection number={5} heading="Propriété intellectuelle">
        <p>
          L'application StockPro, son logo, son code et son contenu éditorial sont la propriété de
          l'équipe StockPro. Aucun élément du service ne peut être reproduit sans autorisation
          écrite préalable. Vous conservez la propriété des données que vous y saisissez.
        </p>
      </LegalSection>

      <LegalSection number={6} heading="Disponibilité et évolutions">
        <p>
          Nous mettons tout en œuvre pour assurer une disponibilité maximale du service. Le
          service peut toutefois être interrompu pour des opérations de maintenance, et évoluer
          dans le temps : certaines fonctionnalités peuvent être ajoutées, modifiées ou retirées.
        </p>
      </LegalSection>

      <LegalSection number={7} heading="Responsabilité">
        <p>
          StockPro est fourni « en l'état ». Nous ne pouvons être tenus responsables des pertes
          indirectes ou du manque à gagner liés à une utilisation du service, ou des conséquences
          de données inexactes saisies par vos soins. Vous êtes responsable de vos décisions de
          réapprovisionnement.
        </p>
      </LegalSection>

      <LegalSection number={8} heading="Suspension et résiliation">
        <p>
          Vous pouvez supprimer votre compte à tout moment. Nous nous réservons le droit de
          suspendre ou de clôturer un compte en cas de non-respect des présentes conditions, après
          avertissement lorsque cela est possible.
        </p>
      </LegalSection>

      <LegalSection number={9} heading="Droit applicable">
        <p>
          Les présentes conditions sont soumises au droit applicable en République du Bénin. À
          défaut de résolution amiable, tout litige relève des juridictions compétentes de
          Porto-Novo.
        </p>
      </LegalSection>

      <LegalSection number={10} heading="Contact">
        <p>
          Pour toute question relative aux présentes conditions, écrivez-nous à{' '}
          <a className="text-brand font-semibold" href="mailto:contact@stockpro.com">
            contact@stockpro.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  )
}