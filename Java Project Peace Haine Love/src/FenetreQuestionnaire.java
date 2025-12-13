import java.awt.*;
import javax.swing.*;
import java.sql.*;

public class FenetreQuestionnaire extends JFrame {
    private JLabel questionLabel;
    private JButton boutonOui, boutonNon, boutonNeutre;

    // Méthode pour récupérer la question à partir de la base de données
    public String getQuestionFromDatabase() {
        String question = "";
        try {
            // Connexion à la base de données
            Statement stmt = App.connexion();
            ResultSet rs = stmt.executeQuery("SELECT textQuestion FROM questions LIMIT 1");  // Remplace "questions" par le nom de ta table et "textQuestion" par ta colonne
            if (rs.next()) {
                question = rs.getString("textQuestion");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Erreur lors de la récupération de la question.");
        }
        return question;
    }

    public FenetreQuestionnaire() {
        setTitle("Questionnaire");
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setSize(400, 300);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout(10, 10));

        // Récupération de la question depuis la base de données
        String questionText = getQuestionFromDatabase();
        questionLabel = new JLabel(questionText.isEmpty() ? "Aucune question disponible" : questionText, SwingConstants.CENTER);
        
        questionLabel.setFont(new Font("Arial", Font.PLAIN, 16));
        add(questionLabel, BorderLayout.NORTH);

        // Panneau pour les boutons, on utilise un GridLayout pour mieux gérer leur disposition
        JPanel panelButtons = new JPanel(new GridLayout(1, 3, 10, 0));  // 1 ligne, 3 colonnes, espacement horizontal de 10 pixels
        boutonOui = new JButton("Oui");
        boutonNon = new JButton("Non");
        boutonNeutre = new JButton("Neutre");

        // Ajouter les boutons au panneau
        panelButtons.add(boutonOui);
        panelButtons.add(boutonNon);
        panelButtons.add(boutonNeutre);

        // Ajouter le panneau des boutons dans la partie basse de la fenêtre
        add(panelButtons, BorderLayout.SOUTH);

        setVisible(true);
    }
}