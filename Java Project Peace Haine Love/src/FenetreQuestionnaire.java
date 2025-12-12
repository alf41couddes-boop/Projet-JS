import java.awt.*;
import javax.swing.*;

public class FenetreQuestionnaire extends JFrame {
    private JLabel questionLabel;
    private JButton boutonOui, boutonNon;
    
    public FenetreQuestionnaire() {
        setTitle("Questionnaire");
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setSize(400, 300);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout(10, 10));

        questionLabel = new JLabel("Texte de la question ici...", SwingConstants.CENTER);
        
        questionLabel.setFont(new Font("Arial", Font.PLAIN, 16));
        add(questionLabel, BorderLayout.NORTH);

        boutonOui = new JButton("Oui");
        boutonNon = new JButton("Non");

        add(boutonOui, BorderLayout.WEST);
        add(boutonNon, BorderLayout.EAST);

        setVisible(true);
    }
}
