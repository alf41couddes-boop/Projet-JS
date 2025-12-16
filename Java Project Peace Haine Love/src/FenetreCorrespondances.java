import java.awt.*;
import javax.swing.*;

public class FenetreCorrespondances extends JFrame {
    private Membre membreConnecte;
    private JTextArea correspondancesArea;
    private JButton closeButton;

    public FenetreCorrespondances(Membre m) {
        this.membreConnecte = m;

        setTitle("Mes Correspondances");
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setSize(400, 300);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout(10, 10));

        correspondancesArea = new JTextArea();
        correspondancesArea.setEditable(false);
        add(new JScrollPane(correspondancesArea), BorderLayout.CENTER);

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
        ListeMembre lm = Db.getAllMembres(); // Récupère tous les membres depuis la base de données
        StringBuilder sb = new StringBuilder();

        System.out.println("Membre connecté : " + membreConnecte.getId());
System.out.println("Nb réponses membre connecté : " + membreConnecte.getListeRep().size());

        for (Membre autreMembre : lm.getMembres()) {
            if (autreMembre.getId() != membreConnecte.getId()) { // Ne pas comparer avec soi-même
                System.out.println("Comparaison avec " + autreMembre.getId() +
    " | réponses : " + autreMembre.getListeRep().size());

                double pourcentage = membreConnecte.comparaison(autreMembre);
                sb.append(autreMembre.getPrenom())
                  .append(" ")
                  .append(autreMembre.getNom())
                  .append(" : ")
                  .append(pourcentage)
                  .append("% de correspondance\n");
            }
        }
        correspondancesArea.setText(sb.toString());
    }

}
