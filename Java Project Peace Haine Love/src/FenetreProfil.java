import java.awt.*;
import javax.swing.*;

public class FenetreProfil extends JFrame{
    private JTextField nom, prenom, age, bio, email, password;
    private JButton correspondancesButton, quitButton, editButton;
    private JPanel form;
    private Membre membreConnecte;
    private boolean modeEdition = false;

    public FenetreProfil(Membre m) {
        this.membreConnecte = m;

        setTitle("Mon Profil");
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setSize(700, 400);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout(10, 10));

        form = new JPanel(new GridLayout(6, 2, 8, 8));
        nom = new JTextField(membreConnecte.getNom());
        form.add(nom);
        nom.setEditable(false);
        prenom = new JTextField(membreConnecte.getPrenom());
        prenom.setEditable(false);
        form.add(prenom);
        age = new JTextField(membreConnecte.getAge()+" ans");
        age.setEditable(false);
        form.add(age);
        bio = new JTextField(membreConnecte.getBio());
        bio.setEditable(false);
        form.add(bio);
        
        add(form, BorderLayout.CENTER);

        JPanel actions = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        correspondancesButton = new JButton("Afficher les correspondances");
        editButton = new JButton("Éditer le profil");
        quitButton = new JButton("Quitter");
        actions.add(quitButton);
        actions.add(editButton);
        actions.add(correspondancesButton);
        add(actions, BorderLayout.SOUTH);

        // Actions
        quitButton.addActionListener(e -> dispose());
        editButton.addActionListener(e -> {

            if (!modeEdition) {
                // MODE ÉDITION
                modeEdition = true;
                editButton.setText("Sauvegarder");

                nom.setEditable(true);
                prenom.setEditable(true);
                age.setEditable(true);
                bio.setEditable(true);

            } else {
                // MODE SAUVEGARDE
                try {
                    int ageValue = Integer.parseInt(age.getText().replace(" ans", "").trim());

                    membreConnecte.setNom(nom.getText());
                    membreConnecte.setPrenom(prenom.getText());
                    membreConnecte.setAge(ageValue);
                    membreConnecte.setBio(bio.getText());

                    Db.updateMembre(membreConnecte);

                    JOptionPane.showMessageDialog(this, "Profil mis à jour !");

                    nom.setEditable(false);
                    prenom.setEditable(false);
                    age.setEditable(false);
                    bio.setEditable(false);

                    editButton.setText("Éditer le profil");
                    modeEdition = false;

                } catch (NumberFormatException ex) {
                    JOptionPane.showMessageDialog(this, "Âge invalide", "Erreur", JOptionPane.ERROR_MESSAGE);
                }
            }
        });

        correspondancesButton.addActionListener(e -> {
            FenetreCorrespondances fenetreCorrespondances = new FenetreCorrespondances(membreConnecte);
            fenetreCorrespondances.setVisible(true);
        });

        setVisible(true);
    }
}
