import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextArea;
import javax.swing.SwingConstants;
import java.awt.BorderLayout;
import java.awt.FlowLayout;
import java.awt.Font;

public class FenetreAccueil extends JFrame {
    private JPanel panelBoutons;
    private JButton bouton1, bouton2, bouton3;
    private JLabel titre;
    private JTextArea illustration;
    
    public FenetreAccueil() {
        JFrame frame = new JFrame("Accueil");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(500, 400);
        frame.setLocationRelativeTo(null);

        frame.setLayout(new BorderLayout());

        titre = new JLabel("Bienvenue sur Peace Haine Love", SwingConstants.CENTER);
        titre.setFont(new Font("Arial", Font.BOLD, 20));
        frame.add(titre, BorderLayout.NORTH);

        String art = 
                    "                                          \n" + //    
                    "                          _.od8888888bo._\r\n" + //
                    "                       .dP\"'   @#@   '\"Yb.\r\n" + //
                    "                     .d\"'      #@#      '\"b.\r\n" + //
                    "                    d\"'        @#@        '\"b\r\n" + //
                    "                   d'          #@#          'b\r\n" + //
                    "                  dP           @#@           Yb\r\n" + //
                    "                  8l          oDWBo          l8\r\n" + //
                    "                  Yb        o@#@B@#@o        dP\r\n" + //
                    "                   YI     o@#* #P# *#@o     IP\r\n" + //
                    "                    YI  o@#*   @#@   *#@o  IP\r\n" + //
                    "                     \"9@#*     #@#     *#@P\"\r\n" + //
                    "                       \"8b     @#@     d8\"\r\n" + //
                    "                         `\"Y888888888P\"` ";

        illustration = new JTextArea(art);
        illustration.setEditable(false);
        illustration.setFont(new Font("Monospaced", Font.PLAIN, 12));    
        frame.add(illustration, BorderLayout.CENTER);

        panelBoutons = new JPanel();
        panelBoutons.setLayout(new FlowLayout(FlowLayout.CENTER, 20, 10));

        bouton1 = new JButton("Se connecter");
        bouton2 = new JButton("Créer un compte");
        bouton3 = new JButton("Quitter");

        panelBoutons.add(bouton1);
        panelBoutons.add(bouton2);
        panelBoutons.add(bouton3);

        frame.add(panelBoutons, BorderLayout.SOUTH);

        frame.setVisible(true);
    }
}
