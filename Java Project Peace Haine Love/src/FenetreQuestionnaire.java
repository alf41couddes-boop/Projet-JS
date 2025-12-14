import java.awt.*;
import javax.swing.*;
import java.sql.*;
import java.awt.event.*;

public class FenetreQuestionnaire extends JFrame {
    private JLabel questionLabel;
    private JButton boutonOui, boutonNon, boutonNeutre;
    private Membre membre;
    private int currentQuestionId;

    // Méthode pour récupérer la question à partir de la base de données
    public String getQuestionFromDatabase(int questionId) {
        String question = "";
        try {
            // Connexion à la base de données
            Statement stmt = Db.connexion();
            ResultSet rs = stmt.executeQuery("SELECT textQuestion FROM questions WHERE id = " + questionId);
            if (rs.next()) {
                question = rs.getString("textQuestion");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Erreur lors de la récupération de la question.");
        }
        return question;
    }

    public FenetreQuestionnaire(Membre membre) {
        this.membre = membre;
        //membre = new Membre(1, "email@exemple.com", "password", "John", "Doe", 30, "Bio de John", new ListeReponse()); // Création du membre avec une ListeReponse vide
        currentQuestionId = 1; // Commencer avec la première question

        setTitle("Questionnaire");
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setSize(400, 300);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout(10, 10));

        // Récupération de la première question depuis la base de données
        String questionText = getQuestionFromDatabase(currentQuestionId);
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

        // Gestion des événements des boutons
        boutonOui.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                enregistrerReponse("Oui");
            }
        });

        boutonNon.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                enregistrerReponse("Non");
            }
        });

        boutonNeutre.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                enregistrerReponse("Neutre");
            }
        });

        setVisible(true);
    }


    // Méthode pour enregistrer la réponse et passer à la question suivante
    private void enregistrerReponse(String reponseTexte) {
        // Enregistrer la réponse dans la ListeReponse du membre
        Question question = new Question(currentQuestionId, getQuestionFromDatabase(currentQuestionId), false); // Faux pour isOpenEnded
        Reponse reponse = new Reponse(currentQuestionId + (reponseTexte.equals("Oui") ? 0.1 : reponseTexte.equals("Non") ? 0.2 : 0.3), reponseTexte, question);
        membre.getListeRep().add(reponse);

        // Passer à la question suivante
        currentQuestionId++;
        String questionText = getQuestionFromDatabase(currentQuestionId);
        if (!questionText.isEmpty()) {
            questionLabel.setText(questionText);
        } else {
            // Si aucune question n'est trouvée, terminer le questionnaire
            JOptionPane.showMessageDialog(this, "Merci d'avoir complété le questionnaire !");
            dispose(); // Fermer la fenêtre du questionnaire
        }
    }
}