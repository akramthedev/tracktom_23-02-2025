import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';

export default function TermsAndConditions({ route }) {




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
            Les conditions d’utilisation
        </Text>

        <Text style={styles.footer}>
          Politique de protection des données personnelles RGPD et Loi 09-08
        </Text>


        <Text style={styles.articleTitle}>ARTICLE 1 : OBJET</Text>
        <Text style={styles.articleBody}>
          Les présentes CGU ou Conditions Générales d’Utilisation encadrent juridiquement l’utilisation des services du site pcs-agri.com et les applications mobile et web de PCS AGRI...
        </Text>

        <Text style={styles.articleTitle}>ARTICLE 2 : MENTION LÉGALES</Text>
        <Text style={styles.articleBody}>
          L’édition du site est assurée par l'entreprise PCS AGRI immatriculée au Registre du Commerce d'Agadir sous le numéro 51395 et dont le siège social est sis à app n° 15 lot 29 cité haut founty, Agadir...
        </Text>

        <Text style={styles.articleTitle}>ARTICLE 3 : ACCÈS AU SITE</Text>
        <Text style={styles.articleBody}>
          Le site permet d’accéder gratuitement aux services suivants : 
        </Text>
        <Text  style={styles.articleBody}>
        &nbsp;&nbsp;&nbsp;• La demande des devis
        </Text>
        <Text  style={styles.articleBody}>
        &nbsp;&nbsp;&nbsp;• L’utilisation du formulaire de contact
        </Text>
        <Text  style={styles.articleBody}>
        &nbsp;&nbsp;&nbsp;• La demande de démonstration
        </Text>
        <Text  style={styles.articleBody}>
        &nbsp;&nbsp;&nbsp;• La demande d’aide
        </Text>



        <Text style={styles.articleTitle}>ARTICLE 4 :  COLLECTE DES DONNÉES</Text>
        <Text style={styles.articleBody}>
        Voir la politique de protection des données personnelles .

</Text>






        <Text style={styles.articleTitle}>ARTICLE 5 : PROPRIÉTÉ INTELLECTUELLE
        </Text>
        <Text style={styles.articleBody}>

        Les marques, logos et contenus présents sur le site PCS AGRI, tels que les illustrations graphiques et les textes, bénéficient d'une protection en vertu du Code de la propriété intellectuelle et du droit d'auteur. Toute reproduction et copie de ces contenus par un utilisateur nécessitent une autorisation préalable de la part du site. Il est important de souligner que toute utilisation à des fins commerciales ou publicitaires est strictement interdite dans ce cas.

</Text>



        <Text style={styles.articleTitle}>
        ARTICLE 6 : INFORMATIONS

        </Text>
        <Text style={styles.articleBody}>
        Bien que les informations publiées sur le site soient réputées fiables, nous tenons à préciser que le site ne peut garantir formellement la fiabilité de toutes les sources. Les informations présentées sur le site PCS AGRI sont fournies à titre purement informatif et n'ont aucune valeur contractuelle. Malgré les mises à jour régulières, nous ne pouvons être tenus responsables des modifications ultérieures des dispositions administratives et juridiques une fois les informations publiées. De même, nous déclinons toute responsabilité quant à l'utilisation et à l'interprétation des informations fournies sur la plateforme. De plus, en cas de force majeure ou d'événements imprévisibles et insurmontables causés par un tiers, le site ne peut être tenu pour responsable. Cependant, nous nous engageons à mettre en œuvre toutes les méthodes nécessaires pour assurer la sécurité et la confidentialité des données au mieux. Nous tenons à souligner que l'utilisateur s'engage à ne pas tenter de compromettre la sécurité du site web en exploitant d'éventuelles vulnérabilités qui pourraient affecter sa confidentialité, son intégrité ou sa disponibilité. Enfin, nous informons les utilisateurs que toute intrusion ou tentative d'intrusion sur le site fera l'objet de poursuites légales conformément aux lois et réglementations en vigueur


          
        </Text>



        <Text style={styles.articleTitle}>
        ARTICLE 7 : LIENS HYPERTEXTES

          </Text>
          <Text style={styles.articleBody}>
          Ce site peut inclure des liens web (URL) vers d’autres sites Internet qui échappent au contrôle de la société qui n’est, en aucun cas, responsable du contenu de ces sites, ne fait aucune déclaration concernant ces sites et n’approuve ni ne désapprouve nécessairement les informations, le matériel, les produits ou les services contenus sur ou accessibles via ces sites. L’utilisateur reconnaît et accepte que son lien vers d’autres sites, son utilisation de ces sites et son utilisation de toute information, matériel, produits et services offerts par ces sites, relèvent uniquement de sa responsabilité.


            
          </Text>





          <Text style={styles.articleTitle}>
          ARTICLE 8 : COOKIES

          </Text>
          <Text style={styles.articleBody}>
          Lors des visites sur le site, un cookie peut être automatiquement installé sur le navigateur de l'utilisateur. Ces petits fichiers temporaires sont nécessaires pour assurer l'accessibilité et la navigation sur le site, mais ils ne contiennent aucune information personnelle identifiable. Les informations des cookies sont utilisées pour améliorer la navigation sur le site. En naviguant sur le site, l'utilisateur accepte l'utilisation des cookies, mais il peut les désactiver via les paramètres de son logiciel de navigation.


            
          </Text>




          <Text style={styles.articleTitle}>
          
          </Text>
          <Text style={styles.articleBody}>
            
            
          </Text>




          <Text style={styles.articleTitle}>
          ARTICLE 9 : RESPONSABILITÉ

          </Text>
          <Text style={styles.articleBody}>
          Ce site a pour but de présenter l'activité de PCS AGRI. Cependant, il est important de noter que les informations fournies sur ce site ne doivent pas être considérées comme un engagement ou une représentation précontractuelle des services de la société, ni comme une description d'une obligation de résultat de quelque manière que ce soit. La société décline toute responsabilité quant à la divulgation du contenu des correspondances des utilisateurs, que ce soit par courrier électronique ou tout autre moyen de communication utilisant Internet, qui pourraient être interceptées par des tiers en raison du mode de transmission des données sur le réseau. En outre, la société ne peut être tenue responsable des conséquences, qu'elles soient directes ou indirectes, résultant d'erreurs de saisie de coordonnées ou d'informations erronées ou incomplètes fournies par l'utilisateur via le site .


            
          </Text>




          <Text style={styles.articleTitle}>
          ARTICLE 10 : DURÉE DU CONTRAT

          </Text>
          <Text style={styles.articleBody}>
          Le présent contrat est valable pour une durée indéterminée. Le début de l’utilisation des services du site marque l’application du contrat à l’égard de l’Utilisateur .


            
          </Text>





          <Text style={styles.articleTitle}>
          ARTICLE 11 : NON RENONCIATION

          </Text>
          <Text style={styles.articleBody}>
          Le défaut de la société d’insister sur l’application stricte de toute disposition de cet accord ne doit pas être interprété comme une renonciation à toute disposition ou droit

          Le présent Contrat est soumis au droit marocain. A défaut d’accord amiable, tout différent qui surviendrait à l’occasion de l’interprétation ou de l’exécution du présent Contrat relèvera de la compétence des tribunaux d'Agadir .


            
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
