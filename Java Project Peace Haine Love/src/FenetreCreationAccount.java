import java.awt.*;
import javax.swing.*;

public class FenetreCreationAccount extends JFrame{
    private JTextField nom, prenom, age, bio, email, password;
    private JButton createButton, cancelButton;
    private JPanel form;

    public FenetreCreationAccount() {
        setTitle("Créer un compte");
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setSize(400, 400);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout(10, 10));

        form = new JPanel(new GridLayout(6, 2, 8, 8));
        form.add(new JLabel("Nom:"));
        nom = new JTextField();
        form.add(nom);
        form.add(new JLabel("Prénom:"));
        prenom = new JTextField();
        form.add(prenom);
        form.add(new JLabel("Âge:"));
        age = new JTextField();
        form.add(age);
        form.add(new JLabel("Bio:"));
        bio = new JTextField();
        form.add(bio);
        form.add(new JLabel("Email:"));
        email = new JTextField();
        form.add(email);
        form.add(new JLabel("Mot de passe:"));
        password = new JTextField();
        form.add(password);
        add(form, BorderLayout.CENTER);

        JPanel actions = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        createButton = new JButton("Créer");
        cancelButton = new JButton("Annuler");
        actions.add(cancelButton);
        actions.add(createButton);
        add(actions, BorderLayout.SOUTH);

        // Actions
        cancelButton.addActionListener(e -> dispose());
        createButton.addActionListener(e -> {
            String nomText = nom.getText();
            String prenomText = prenom.getText();
            String ageText = age.getText();
            String bioText = bio.getText();
            String emailText = email.getText();
            String passwordText = password.getText();

            
        Db.addMember(nomText, prenomText, emailText, passwordText, bioText);
        JOptionPane.showMessageDialog(this, "Compte créé pour: " + prenomText + " " + nomText + 
        
        "\nAfin de vérifier votre comptabilité de haine, veuillez maintenant remplir le questionnaire.");

            // Crée l'objet Membre pour la fenêtre questionnaire (âge ignoré -> 0)
            Membre nouveauMembre = new Membre(0,emailText,passwordText,nomText,prenomText,0,bioText,new ListeReponse()
            );

            FenetreQuestionnaire fenetreQuestionnaire = new FenetreQuestionnaire(nouveauMembre);
            dispose();
            fenetreQuestionnaire.setVisible(true);
        });
    }
}
