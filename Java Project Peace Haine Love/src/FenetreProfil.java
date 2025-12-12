import java.awt.*;
import javax.swing.*;

public class FenetreProfil extends JFrame{
    private JTextField nom, prenom, age, bio, email, password;
    private JButton createButton, cancelButton;
    private JPanel form;
    private Membre membreConnecte;

    public FenetreProfil(Membre m) {
        this.membreConnecte = m;

        setTitle("Mon Profil");
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setSize(400, 400);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout(10, 10));

        form = new JPanel(new GridLayout(6, 2, 8, 8));
        nom = new JTextField(membreConnecte.getNom());
        form.add(nom);
        prenom = new JTextField(membreConnecte.getPrenom());
        form.add(prenom);
        age = new JTextField(membreConnecte.getAge()+" ans");
        form.add(age);
        bio = new JTextField(membreConnecte.getBio());
        form.add(bio);
        
        add(form, BorderLayout.CENTER);

        JPanel actions = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        createButton = new JButton("Afficher les correspondances");
        actions.add(createButton);
        add(actions, BorderLayout.SOUTH);

        // Actions
        cancelButton.addActionListener(e -> dispose());
        createButton.addActionListener(e -> {
            
        });
    }
}
