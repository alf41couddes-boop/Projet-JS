import java.awt.*;
import java.awt.event.*;
import javax.swing.*;

public class FenetreAdmin extends JFrame implements ActionListener {

    private JTextArea questionTexte;
    private JCheckBox questionTexteLibre;
    private JTextField questionIdField;
    private JTextField reponseTexte;
    private JMenuItem itemQuestion, itemReponse;
    private JButton btnAjouter;

    private JPanel content;
    private JPanel panneauQuestion, panneauReponse;
    private CardLayout gestionnaireFenetre;
    private String panneauActuel = "question"; //variable selon type d'affichage par defaut question

    public FenetreAdmin() {
        setTitle("Admin - Ajouter Question ou Réponse");
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setSize(600, 380);
        setLocationRelativeTo(null); // centre la fenêtre
        setLayout(new BorderLayout(10, 10));

        // === Menu Bar ===
        JMenuBar menuBar = new JMenuBar();
        itemQuestion = new JMenuItem("Question");
        itemReponse = new JMenuItem("Réponse");
        itemQuestion.addActionListener(this);
        itemReponse.addActionListener(this);
        menuBar.add(itemQuestion);
        menuBar.add(itemReponse);
        setJMenuBar(menuBar);

        // CardLayout 
        gestionnaireFenetre = new CardLayout();
        content = new JPanel();
        content.setLayout(gestionnaireFenetre);

        // Panel Question
        panneauQuestion = new JPanel();
        panneauQuestion.setLayout(null);
        panneauQuestion.add(createLabel("Texte de la question:", 50, 50));
        questionTexte = new JTextArea();
        questionTexte.setBounds(50, 75, 500, 100);
        panneauQuestion.add(questionTexte);
        questionTexteLibre = new JCheckBox("Texte libre");
        questionTexteLibre.setBounds(50, 185, 200, 20);
        panneauQuestion.add(questionTexteLibre);

        // Panel Réponse
        panneauReponse = new JPanel();
        panneauReponse.setLayout(null);
        panneauReponse.add(createLabel("ID Question:", 50, 50));
        questionIdField = new JTextField();
        questionIdField.setBounds(160, 50, 150, 25);
        panneauReponse.add(questionIdField);
        panneauReponse.add(createLabel("Texte de la réponse:", 50, 90));
        reponseTexte = new JTextField();
        reponseTexte.setBounds(50, 115, 500, 100);
        panneauReponse.add(reponseTexte);

        content.add(panneauQuestion, "question");
        content.add(panneauReponse, "reponse");
        add(content, BorderLayout.CENTER);

        // bouton du bas
        JPanel bottom = new JPanel(new FlowLayout(FlowLayout.CENTER));
        btnAjouter = new JButton("Ajouter");
        JButton fermer = new JButton("Fermer");
        btnAjouter.addActionListener(this);
        fermer.addActionListener(e -> dispose());
        bottom.add(btnAjouter);
        bottom.add(fermer);
        add(bottom, BorderLayout.SOUTH);

        gestionnaireFenetre.show(content, "question");
        setVisible(true);
    }


    private JLabel createLabel(String text, int x, int y) {
        JLabel label = new JLabel(text);
        label.setBounds(x, y, 200, 20);
        return label;
    }

    
    public void actionPerformed(ActionEvent e) { //quand y'a un click
        if (e.getSource() == itemQuestion) { //si item question cliqué
            gestionnaireFenetre.show(content, "question");
            panneauActuel = "question";

        } else if (e.getSource() == itemReponse) { //si item reponse cliqué
            gestionnaireFenetre.show(content, "reponse");
            panneauActuel = "reponse";
        } else if (e.getSource() == btnAjouter) { //si bouton ajouter cliqué
            onAjouter();
        }
    }

    private void onAjouter() { //fonction ajout, depend de question/reponse

        if (panneauActuel.equals("question")) { //si question (equal pcq string)
            String texte = questionTexte.getText().trim();
            if (texte.isEmpty()) {
                JOptionPane.showMessageDialog(this, "Texte vide", "Erreur", JOptionPane.ERROR_MESSAGE); //pop up erreur
                return;
            }
            int id = Db.addQuestion(texte, questionTexteLibre.isSelected());
            if (id > 0) {                                                                   //si id positif
                JOptionPane.showMessageDialog(this, "Question ajoutée (id=" + id + ")");    // popo up reussite
                questionTexte.setText("");                                                //reset les champs de txt
                questionTexteLibre.setSelected(false);
            }
        } else 
            
        if (panneauActuel.equals("reponse")) { //si reponse
            String idStr = questionIdField.getText().trim(); // get id question sous string
            if (idStr.isEmpty()) { //erreur si vide
                JOptionPane.showMessageDialog(this, "ID vide", "Erreur", JOptionPane.ERROR_MESSAGE);
                return;
            }
            try {
                int idQuestion = Integer.parseInt(idStr); //parse id
                String texte = reponseTexte.getText().trim();
                if (texte.isEmpty()) {
                    JOptionPane.showMessageDialog(this, "Texte vide", "Erreur", JOptionPane.ERROR_MESSAGE);
                    return;
                }
                int id = Db.addReponse(texte, idQuestion); //fonction DB ajout reponse
                if (id > 0) { //que si id positif
                    JOptionPane.showMessageDialog(this, "Réponse ajoutée (id=" + id + ")");
                    questionIdField.setText(""); 
                    reponseTexte.setText("");
                }
            } catch (NumberFormatException ex) {
                JOptionPane.showMessageDialog(this, "ID invalide", "Erreur", JOptionPane.ERROR_MESSAGE);
            }
        }
    }
}
