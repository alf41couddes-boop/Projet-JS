import java.awt.*;
import javax.swing.*;
import javax.swing.border.EmptyBorder;

public class FenetreQuestionnaire extends JFrame {
    private JLabel questionLabel;
    private JPanel panelBoutons;
    private JButton boutonOui, boutonNon;
    private JTextArea questionsArea;
    
    public FenetreQuestionnaire() {
        setTitle("Questionnaire");
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setSize(400, 300);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout(10, 10));

        questionLabel = new JLabel("Texte de la question ici...", SwingConstants.CENTER);
        questionLabel.setFont(new Font("Arial", Font.PLAIN, 16));
        add(questionLabel, BorderLayout.NORTH);

        panelBoutons = new JPanel(new BorderLayout());

        boutonOui = new JButton("Oui");
        boutonNon = new JButton("Non");

        panelBoutons.add(boutonOui, BorderLayout.WEST);
        panelBoutons.add(boutonNon, BorderLayout.EAST);

        add(panelBoutons, BorderLayout.CENTER);
        setVisible(true);
    }
}
