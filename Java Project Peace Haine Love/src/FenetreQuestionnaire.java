import java.awt.*;
import javax.swing.*;
import java.sql.*;
import java.util.ArrayList;

public class FenetreQuestionnaire extends JFrame {
    private JLabel questionLabel;
    private JPanel panelButtons;
    private Membre membre;
    private int currentQuestionId;

    // Méthode pour récupérer la question à partir de la base de données
    public String getQuestionFromDatabase(int questionId) {
        String question = "";
        try {
            // Connexion à la base de données
            Statement stmt = Db.connexion();
            ResultSet rs = stmt.executeQuery("SELECT texte FROM question WHERE id = " + questionId);
            if (rs.next()) {
                question = rs.getString("texte");
            }
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println("Erreur lors de la récupération de la question.");
        }
        return question;
    }

    public static ArrayList<Reponse> getReponsesByQuestionId(int questionId) {
    ArrayList<Reponse> reponses = new ArrayList<>();
    try {
        Statement stmt = Db.connexion(); // connexion à la base
        ResultSet rs = stmt.executeQuery("SELECT id, texte FROM reponse WHERE id_question = " + questionId);
        Question q = new Question(questionId, "", false); // question associée (texte inutile ici)
        while (rs.next()) {
            Reponse r = new Reponse(rs.getInt("id"), rs.getString("texte"), q);
            reponses.add(r);
        }
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return reponses;
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
        //panelButtons = new JPanel();
        //panelButtons.setLayout(new GridLayout(0, 1, 5, 5)); // 1 colonne, autant de lignes que de réponses
        //add(panelButtons, BorderLayout.SOUTH);
        add(questionLabel, BorderLayout.NORTH);

        panelButtons = new JPanel();
        panelButtons.setLayout(new GridLayout(0, 1, 5, 5)); // 1 colonne, autant de lignes que de réponses
        JScrollPane scrollPane = new JScrollPane(panelButtons);
        add(scrollPane, BorderLayout.CENTER);

        afficherQuestion(currentQuestionId);

        setVisible(true);
    }

    private void afficherQuestion(int questionId) {
        // Récupérer le texte de la question
        String questionTexte = getQuestionFromDatabase(questionId);
        if (questionTexte.isEmpty()) {
            // Fin du questionnaire
            JOptionPane.showMessageDialog(this, "Merci d'avoir complété le questionnaire !\nMaintenant vous pouvez accéder à votre profil et commencer l'aventure de la HAINE...");
            dispose();
            new FenetreProfil(membre).setVisible(true);
            return;
        }

        questionLabel.setText(questionTexte);

        // Supprimer les anciens boutons
        panelButtons.removeAll();

        // Récupérer les réponses depuis la base
        ArrayList<Reponse> reponses = Db.getReponsesByQuestionId(questionId);

        // Créer un bouton pour chaque réponse
        for (Reponse r : reponses) {
            JButton btn = new JButton(r.getTexteRep());
            btn.addActionListener(e -> {
                membre.getListeRep().add(r);  // Ajouter la réponse au membre
                currentQuestionId++;
                afficherQuestion(currentQuestionId); // Passer à la question suivante
            });
            panelButtons.add(btn);
        }

        // Mettre à jour l'affichage
        panelButtons.revalidate();
        panelButtons.repaint();
    }

}