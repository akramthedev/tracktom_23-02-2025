import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';

export default function Politique({ route }) {




   const [fontsLoaded] = useFonts({
              'DMSerifDisplay': require('../fonts/DMSerifDisplay-Regular.ttf'),
              'Inter': require('../fonts/Inter-VariableFont_opsz,wght.ttf'),
              "InriaLight": require('../fonts/InriaSerif-Light.ttf'),
              "InriaBold": require('../fonts/InriaSerif-Bold.ttf'),
              "InterBold": require('../fonts/Inter_24pt-Black.ttf'),
          });




          
    if (!fontsLoaded) {
      return null;
  }


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>
        Politique de protection de données personnelles RGPD et Loi 09-08
        </Text>
      </View>
       
        <View style={styles.container}>
    

        <Text style={styles.articleTitle}>Préambule :</Text>
        <Text style={styles.articleBody}>
        Le responsable de traitement, PCS AGRI, est une société à responsabilité limitée de droit marocain immatriculée au Registre du Commerce d'Agadir sous le numéro 51395, sise à APP N 15 LOT 29 CITE HAUT FOUNTY Agadir, Sous Massa, Maroc. (Ci-après dénommée « PCS AGRI » ou « nous »).
        Afin de se conformer aux textes réglementaires et légaux et respecter les données personnelles de ses clients, PCS AGRI a mis en place une politique de confidentialité applicable aux données à caractère personnel collectées dans le cadre de ses « Gestion Clients » ou « Recrutement ».
        </Text>

        <Text style={styles.articleTitle}>La présente Politique :</Text>
        <Text  style={styles.articleBody}>
        &nbsp;&nbsp;&nbsp; 1. Couvre les collectes de données personnelles que nous collectons par l’intermédiaire de nos sites internet ou applications mobiles
        </Text>
        <Text  style={styles.articleBody}>
        &nbsp;&nbsp;&nbsp; 2. Détaille la manière dont les informations recueillies via nos sites internet sont utilisées et protégées 
        </Text>
        <Text  style={styles.articleBody}>
        &nbsp;&nbsp;&nbsp; 3. Donne des renseignements concernant vos droits d’accès, de rectification, de suppression ou d’opposition relatifs à vos données personnelles .
        En utilisant un Site et/ou un Service, et en nous fournissant vos données personnelles, vous consentez au traitement de vos données personnelles de la manière décrite dans cette politique de confidentialité.
        </Text>
        
         

        <Text style={styles.articleTitle}>1 Les personnes concernées par la collecte des données personnelles :</Text>
        <Text style={styles.articleBody}>
            Dans le cadre de la fourniture de nos services, nous pouvons collecter des informations relatives aux personnes suivantes :
            1. Les utilisateurs de nos sites internet et/ de nos applications,
            2. Les candidats dans le cadre d’un recrutement
            Ci-après collectivement désignées « vous », « votre » ou « vos ».
        </Text>



        <Text style={styles.articleTitle}>2 Les catégories de données personnelles que nous collectons et les finalités de la collecte : </Text>
        <Text style={styles.articleBody}>
        2.1 Finalités principales de traitements
        </Text>

        <Text>
        1. Créer et administrer votre compte ;

        </Text>

        <Text>
        2. Gérer votre candidature à une de nos offres d’emploi et évaluer votre aptitude au poste concerné (lors du recrutement).

        </Text>

        <Text>
        2.2 Données que vous nous fournissez volontairement : Il s’agit de :
        Finalité gestion clients :

        </Text>

        <Text>
            Nom et prénom
            / E-mail
            / Numéro de téléphone
            Finalité gestion des ressources humaines :
            / Nom et prénom
            / Titre
            / Revenu
            / CV
            / adresse
            / Numéro CIN
            / Numéro du permis de conduire
            / Type du permis de conduire
            / Numéro Sécurité Sociale
            / RIB
            / Date et lieu de naissance
            / Situation familiale
            / Numéro de téléphone
            / E-mail
        </Text>

        <Text>
        2. 3 Données collectées automatiquement
        </Text>

        <Text>
        Ces données peuvent inclure votre adresse IP, le type d'appareil, les détails du système d'exploitation, les numéros d'identification uniques (y compris les identifiants publicitaires mobiles), le type de navigateur, la langue du navigateur.
        Finalités principales de traitement :
        </Text>

        <Text>
        1. Amélioration de la qualité, la pertinence et la sécurité de nos Sites et Services afin d’offrir une expérience personnalisée aux utilisateurs de nos sites internet et services.

        </Text>

        <Text>
        2. Blocage des adresses IP en cas de violation des Conditions d'utilisation de nos sites internet.

        </Text>

        <Text>
        Ce traitement est autorisé par la CNDP sous le N° D-GC-1127/2023
        </Text>

             
        



        <Text style={styles.articleTitle}>4 Stockage de vos données personnelles :</Text>
        <Text style={styles.articleBody}>
        Vos données sont stockées chez l’hébergeur Microsft France en France
        </Text>


        <Text style={styles.articleTitle}>5 Partage et divulgation de vos données personnelles

</Text>
        <Text style={styles.articleBody}>
        Nous pouvons être amenés à communiquer vos données personnelles, dans le cadre unique de pouvoir vous satisfaire lors de l’utilisation de nos Services, à des destinataires internes et/ou à des destinataires externes
Destinataire internes :
Il s’agit ici de tout le personnel interne amené à intervenir pour vous fournir les Services de PCS AGRI ou pour gérer votre compte tels que le service technique, le service administratif.
Destinataire externe :
L’entreprise en charge de la comptabilité.
Conformément à nos instructions, nos fournisseurs et prestataires de services peuvent traiter ou stocker des données personnelles dans le cadre de l'exercice de leurs fonctions.
Notez qu’à chaque fois que nous partageons des données personnelles, nous prenons toutes les mesures raisonnables pour nous assurer qu'elles sont traitées en toute sécurité et conformément à la présente Politique de confidentialité.
        </Text>



        <Text style={styles.articleTitle}>6 Conservation des données</Text>
        <Text style={styles.articleBody}>
        Nous stockons vos informations pour une durée proportionnée à l’objectif pour lequel nous les traitons dans le respect des limites imposées par les textes législatifs et réglementaires.
        Par ailleurs, il est à noter que même après la fin de notre relation commerciale, il est possible que nous conservions certaines informations si nous en estimons un besoin légitime. Pour les candidats à l’embauche, leurs informations peuvent être conservées dans notre base de données pour une durée de 24 mois pour les contacter au sujet de futures opportunités, à moins les personnes concernées le refusent.
        </Text>



        <Text style={styles.articleTitle}>7 Personnes mineures</Text>
        <Text style={styles.articleBody}>
        En utilisant les sites internet et les services de PCS AGRI, vous nous garantissez être une personne majeure.
        Si vous pensez que nous traitons des données de mineurs nous vous remercions de nous contacter via l’adresse dpo@pcs-agri.com.


        </Text>



        <Text style={styles.articleTitle}>8 Vos droits</Text>
        <Text style={styles.articleBody}>
        Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée et du Règlement Général Sur la Protection des Données (2016/679) (le « RGPD ») et à la loi 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, vous disposez des droits suivants :
        </Text>
        <Text>
        1. Le droit d'accès aux informations personnelles que nous détenons à votre sujet ;
        </Text>
        <Text>
        2. Le droit de nous demander de mettre à jour ou de corriger toute information personnelle vous concernant ;
        </Text>
        <Text>
        3. Le droit de demander une copie de vos données. Ces copies pourront être facturées ;
        </Text>
        <Text>
        4. Le droit de retirer votre consentement au traitement de vos données personnelles à tout moment, lorsque ce traitement est fondé sur votre consentement ;
        </Text>
        <Text>
        5. Le droit de vous opposer à la réception de communications commerciales et marketing ;
        </Text>
        <Text>
        6. Le droit à l'effacement ;
        </Text>
        <Text>
        7. Le droit à la limitation du traitement. Ici la limitation dépendra de la nature de la prestation que nous vous fournissons telle que celle de l’enregistrement des noms de domaine qui nécessite les données de contact physique ;
        </Text>
        <Text>
        8. Le droit à la portabilité des données ;
        </Text>
        <Text>
        9. Le droit de vous opposer au traitement des données personnelles vous concernant ;
        </Text>
        <Text>
        10.Le droit de déposer une plainte auprès d'une autorité de régulation, à savoir au Maroc la CNDP.
        Vous pouvez exercer ces droits en tout temps en nous envoyant un e-mail à dpo@pcs-agri.com.
        </Text>



        <Text style={styles.articleTitle}>9 Sécurité des données personnelles</Text>
        <Text style={styles.articleBody}>
        PCS Agri met en œuvre les moyens appropriés pour préserver la sécurité et la confidentialité des données, via des procédures physiques, administratives, techniques et organisationnelles de protection raisonnables et répondant aux plus hauts standards de sécurité. Ces procédures de protection varient en fonction de la sensibilité des informations que nous collectons, traitons et stockons et de l'état actuel de la technologie.
        Par ailleurs, vous êtes seuls responsables de la sécurité et de la confidentialité des identifiants de connexion que vous avez créés ou reçu pour accéder à votre espace client.
        </Text>



        <Text style={styles.articleTitle}>10 Contact

</Text>
        <Text style={styles.articleBody}>
        Si vous avez des questions ou réclamation à propos de la présente politique de confidentialité ou sur le traitement de vos données par PCS AGRI, vous pouvez contacter notre délégué à la protection des données par email à dpo@pcs-agri.com ou à l'adresse postale suivante : APP N 15 LOT 29 CITE HAUT FOUNTY Agadir, Sous-Massa, Maroc.
        </Text>


 




         
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop : 40, 
    backgroundColor : "white", 
},
  container: {
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor : "white"
  },
  title: {
    fontSize: 25,
    letterSpacing: 0,
    textAlign: 'center',
    marginBottom: 20,
    color: '#BE2929',
    fontFamily : "InriaBold", 
  },
  articleTitle: {
    fontSize: 17,
    marginTop: 15,
    marginBottom: 5,
    fontFamily : "Inter", 
    fontWeight : "bold",
    color: '#BE2929',
  },
  articleBody: {
    fontSize: 14,
    fontFamily : "Inter",
    marginBottom: 15,
    color: 'black',
  },
  footer: {
    fontSize: 13,
    color:"rgb(180, 0, 0)",
    marginTop: 10,
    fontWeight : 'Inter',
    fontWeight : "bold",
    textAlign: 'center',
  },
});
