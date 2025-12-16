import java.awt.*;
import javax.swing.*;

public class FenetreConnect extends JFrame { //fait en vif avec l'IA mais ça aura cette gueule je pense, 
//                                              jsp comment check que c'est un bon password etc ou pas
    private JTextField emailField;
    private JPasswordField passwordField;
    private JButton loginButton, cancelButton;
    private static FenetreAccueil FenetreAccueil;

    public FenetreConnect() {
        super("Connexion");
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);//ferme seulement cette fenetre
        setSize(350, 220);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout(10, 10)); 

        JPanel form = new JPanel(new GridLayout(2, 2, 8, 8));
        form.add(new JLabel("Email:"));
        emailField = new JTextField();
        form.add(emailField);
        form.add(new JLabel("Mot de passe:"));
        passwordField = new JPasswordField();
        form.add(passwordField);
        add(form, BorderLayout.CENTER);

        JPanel actions = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        loginButton = new JButton("Se connecter");
        cancelButton = new JButton("Annuler");
        actions.add(cancelButton);
        actions.add(loginButton);
        add(actions, BorderLayout.SOUTH);

        // Actions
        cancelButton.addActionListener(e -> dispose());
        loginButton.addActionListener(e -> {
            String email = emailField.getText();
            String password = new String(passwordField.getPassword());

            if (Db.connectUtilisateur(email, password)) {
                JOptionPane.showMessageDialog(this, "Connexion réussie pour: " + email);
                Db.connexion(); // Initialise la connexion globale pour isAdmin
                if(Db.isAdmin(email)) {
                    System.out.println("Admin connecté");
                    
                    FenetreAdmin fenetreAdmin = new FenetreAdmin();
                    dispose();

                } else {
                    System.out.println("Utilisateur connecté");

                    Membre membreConnecte = Db.getMembreByEmail(email);
                    FenetreProfil fenetreProfil = new FenetreProfil(membreConnecte);
                    dispose();
                    fenetreProfil.setVisible(true);
                }
                dispose();
            } else {
                JOptionPane.showMessageDialog(this, "Email ou mot de passe incorrect.", "Erreur", JOptionPane.ERROR_MESSAGE);
            }
        });
    }
}
