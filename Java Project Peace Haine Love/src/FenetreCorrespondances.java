import java.awt.*;
import java.util.ArrayList;
import java.util.List;
import javax.swing.*;

public class FenetreCorrespondances extends JFrame {
    private Membre membreConnecte;
    private JPanel correspondancesPanel;
    private JScrollPane scrollPane;

    public FenetreCorrespondances(Membre m) {
        this.membreConnecte = m;

        setTitle("Mes Correspondances");
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setSize(500, 400);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout(10, 10));

        correspondancesPanel = new JPanel();
        correspondancesPanel.setLayout(new BoxLayout(correspondancesPanel, BoxLayout.Y_AXIS));

        scrollPane = new JScrollPane(correspondancesPanel);
        add(scrollPane, BorderLayout.CENTER);

        afficherCorrespondances();

        setVisible(true);
    }

    private void afficherCorrespondances() {
        correspondancesPanel.removeAll();

        ListeMembre lm = Db.getAllMembres();
        List<MembreScore> scores = new ArrayList<>();

        for (Membre autreMembre : lm.getMembres()) {
            if (autreMembre.getId() != membreConnecte.getId()) {
                double pourcentage = membreConnecte.comparaison(autreMembre);
                scores.add(new MembreScore(autreMembre, pourcentage));
            }
        }

        // Tri décroissant
        scores.sort((a, b) -> Double.compare(b.score, a.score));

        for (MembreScore ms : scores) {
            JPanel panel = new JPanel(new FlowLayout(FlowLayout.LEFT));
            JLabel label = new JLabel(ms.membre.getPrenom() + " " + ms.membre.getNom() +
                                      " : " + ms.score + "% de correspondance");
            JButton likeButton = new JButton("Liker");

            // Action bouton like
            likeButton.addActionListener(e -> {
                Db.likerMembre(membreConnecte.getId(), ms.membre.getId());
                JOptionPane.showMessageDialog(this, "Vous avez liké " +
                        ms.membre.getPrenom() + " " + ms.membre.getNom() + " !");
            });

            panel.add(label);
            panel.add(likeButton);
            correspondancesPanel.add(panel);
        }

        correspondancesPanel.revalidate();
        correspondancesPanel.repaint();
    }

    // Classe interne pour trier les membres
    private static class MembreScore {
        Membre membre;
        double score;

        MembreScore(Membre m, double s) {
            this.membre = m;
            this.score = s;
        }
    }
}
