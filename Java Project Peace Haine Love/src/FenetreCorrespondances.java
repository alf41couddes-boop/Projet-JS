import java.awt.*;
import javax.swing.*;

public class FenetreCorrespondances extends JFrame {
    private Membre membreConnecte;
    private JPanel correspondancesPanel;
    private JButton closeButton;

    public FenetreCorrespondances(Membre m) {
        this.membreConnecte = m;

        setTitle("Mes Correspondances");
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setSize(400, 300);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout(10, 10));

        correspondancesPanel = new JPanel();
        correspondancesPanel.setLayout(new BoxLayout(correspondancesPanel, BoxLayout.Y_AXIS));
        JScrollPane scrollPane = new JScrollPane(correspondancesPanel);
        add(scrollPane, BorderLayout.CENTER);

        closeButton = new JButton("Fermer");
        JPanel actions = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        actions.add(closeButton);
        add(actions, BorderLayout.SOUTH);

        // Actions
        closeButton.addActionListener(e -> dispose());

        afficherCorrespondances();
        setVisible(true);
    }

    private void afficherCorrespondances() {
    ListeMembre lm = Db.getAllMembres();
    correspondancesPanel.removeAll(); // vider avant de remplir

    for (Membre autreMembre : lm.getMembres()) {
        if (autreMembre.getId() != membreConnecte.getId()) {

            double pourcentage = membreConnecte.comparaison(autreMembre);

            // Panel pour ce membre
            JPanel panelMembre = new JPanel(new FlowLayout(FlowLayout.LEFT));
            JLabel label = new JLabel(autreMembre.getPrenom() + " " + autreMembre.getNom() 
                                      + " : " + pourcentage + "% de correspondance");
            JButton likerButton = new JButton("Like ;)");

            // Action du bouton
            likerButton.addActionListener(e -> {
                Db.likerMembre(autreMembre.getId(), membreConnecte.getId());
                JOptionPane.showMessageDialog(this, "Vous avez liké " + autreMembre.getPrenom());
                System.out.println("Vous avez liké " + autreMembre.getPrenom());
            });

            panelMembre.add(label);
            panelMembre.add(likerButton);

            correspondancesPanel.add(panelMembre);
        }
    }

    correspondancesPanel.revalidate();
    correspondancesPanel.repaint();
}


}
