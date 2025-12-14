import java.sql.*;

public class AppSQL {
    public static void main(String[] args) throws Exception {
        // Test de connexion à la base de données
        System.out.println("=== Test de connexion à la base de données ===");
        Statement stmt = Db.connexion();
        System.out.println("✓ Connexion réussie à la base de données !");
        System.out.println("===============================================\n");
        
        // Afficher les réponses de la base de données
        System.out.println("=== Affichage des réponses ===\n");
        ListeReponse listeReponses = afficherReponsesFromDB(stmt);
        listeReponses.afficheListeRep();
        System.out.println("\n=== Fin de l'affichage ===");
        
        stmt.close();
    }
    
    // Méthode pour récupérer les réponses de la base de données
    public static ListeReponse afficherReponsesFromDB(Statement stmt) {
        ListeReponse listeReponses = new ListeReponse();
        
        try {
            String query = "SELECT r.id, r.texte, q.id as idQuestion, q.texte as texte_question, q.texte_libre FROM reponse r JOIN question q ON r.question_id = q.id ORDER BY q.id, r.id";
            
            ResultSet rs = stmt.executeQuery(query);
            
            while(rs.next()) {
                int idReponse = rs.getInt("id");
                String texteReponse = rs.getString("texte");
                int idQuestion = rs.getInt("idQuestion");
                String texteQuestion = rs.getString("texte_question");
                boolean texteLong = rs.getBoolean("texte_libre");
                
                // Créer l'objet Question
                Question q = new Question(idQuestion, texteQuestion, texteLong);
                
                // Créer l'objet Reponse (avec int au lieu de double)
                Reponse r = new Reponse(idReponse, texteReponse, q);
                
                // Ajouter à la liste
                listeReponses.add(r);
            }
            
            rs.close();
            
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Erreur lors de la récupération des réponses");
        }
        
        return listeReponses;
    }
}