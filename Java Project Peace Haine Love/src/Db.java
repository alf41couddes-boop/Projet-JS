import java.sql.*;
import java.util.ArrayList;


public class Db {
    private static Connection conn = null;
    private static Statement stmt = null;
public static Statement connexion() {

    try {
        String url = "jdbc:mysql://localhost:3306/peace?useSSL=false&useUnicode=true";
        Class.forName("com.mysql.cj.jdbc.Driver");
        conn = DriverManager.getConnection(url, "user", "user");
        System.out.println("connexion réussi");
        stmt = conn.createStatement();
        return stmt;
    } catch (Exception e) {
        e.printStackTrace();
        System.out.println("Erreur");
        System.exit(0);
        return null;
    }
}

public static int addQuestion(String texte, boolean texteLibre) {
    try {
        String url = "jdbc:mysql://localhost:3306/peace?useSSL=false&useUnicode=true";
        Class.forName("com.mysql.cj.jdbc.Driver");
        Connection connLocal = DriverManager.getConnection(url, "user", "user");
        
        try (PreparedStatement ps = connLocal.prepareStatement("INSERT INTO question (texte, texte_libre) VALUES (?, ?)",
                Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, texte);
            ps.setBoolean(2, texteLibre);
            ps.executeUpdate();
            try (ResultSet keys = ps.getGeneratedKeys()) { 
                if (keys.next()) return keys.getInt(1);
            }
        }
        connLocal.close();
    } catch (Exception e) {
        // ignore
    }
    return -1;
}

public static int addReponse(String texte, int idQuestion) {
    try {
        String url = "jdbc:mysql://localhost:3306/peace?useSSL=false&useUnicode=true";
        Class.forName("com.mysql.cj.jdbc.Driver");
        Connection connLocal = DriverManager.getConnection(url, "user", "user");
        
        try (PreparedStatement ps = connLocal.prepareStatement("INSERT INTO reponse (texte, question_id) VALUES (?, ?)",
                Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, texte);
            ps.setInt(2, idQuestion);
            ps.executeUpdate();
            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) return keys.getInt(1);
            }
        }
        connLocal.close();
    } catch (Exception e) {
        // ignore
    }
    return -1;
}

public static boolean connectUtilisateur(String email, String password) {
    try {
        String url = "jdbc:mysql://localhost:3306/peace?useSSL=false&useUnicode=true";
        Class.forName("com.mysql.cj.jdbc.Driver");
        Connection conn = DriverManager.getConnection(url, "user", "user");
        
        String sql = "SELECT * FROM utilisateur WHERE email = ? AND password = ?";
        PreparedStatement pstmt = conn.prepareStatement(sql); //prepa commande
        pstmt.setString(1, email);  
        pstmt.setString(2, password);
        
        ResultSet rs = pstmt.executeQuery();
        boolean exists = rs.next();
        
        rs.close();
        pstmt.close();
        conn.close();
        
        return exists;
    } catch (Exception e) {
        e.printStackTrace();
        return false;
    }
}

    public static boolean isAdmin(String email) {
        
        try {
            String sql = "SELECT type_utilisateur FROM utilisateur WHERE email = ?"; //colone admin ou user
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, email);
            
            ResultSet rs = pstmt.executeQuery();
            boolean isAdmin = false;
            if (rs.next()) {
                String type = rs.getString("type_utilisateur");
                if (type != null && type.equals("admin")) {
                    isAdmin = true;
                }
            }
            
            rs.close();
            pstmt.close();
            
            return isAdmin;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

public static void addMember(String nom, String prenom, String email, String pwd, String bio) {
    try {
        String url = "jdbc:mysql://localhost:3306/peace?useSSL=false&useUnicode=true";
        Class.forName("com.mysql.cj.jdbc.Driver");
        Connection conn = DriverManager.getConnection(url, "user", "user");
        
        String sql = "INSERT INTO utilisateur (email, password, nom, prenom, age, bio, type_utilisateur) VALUES (?, ?, ?, ?, 0, ?, 'membre') ; ";
                        
        PreparedStatement pstmt = conn.prepareStatement(sql); //prepa commande
        pstmt.setString(1, email);  
        pstmt.setString(2, pwd);
        pstmt.setString(3, nom);
        pstmt.setString(4, prenom);
        pstmt.setString(5, bio);
        
        pstmt.executeUpdate();
        pstmt.close();
        conn.close();
    
    } catch (Exception e) {
        e.printStackTrace();
    }
}

    public static Membre getMembreByEmail(String email) {
    try {
        String url = "jdbc:mysql://localhost:3306/peace?useSSL=false&useUnicode=true";
        Class.forName("com.mysql.cj.jdbc.Driver");
        Connection conn = DriverManager.getConnection(url, "user", "user");

        String sql = "SELECT * FROM utilisateur WHERE email = ?";
        PreparedStatement pstmt = conn.prepareStatement(sql);
        pstmt.setString(1, email);

        ResultSet rs = pstmt.executeQuery();

        if (rs.next()) {
            int id = rs.getInt("id");
            String password = rs.getString("password");
            String nom = rs.getString("nom");
            String prenom = rs.getString("prenom");
            int age = rs.getInt("age");
            String bio = rs.getString("bio");

            Membre membre = new Membre(
                id,
                email,
                password,
                nom,
                prenom,
                age,
                bio,
                getReponsesByMembreId(id)
            );

            rs.close();
            pstmt.close();
            conn.close();

            return membre;
        }

        rs.close();
        pstmt.close();
        conn.close();
        return null;

    } catch (Exception e) {
        e.printStackTrace();
        return null;
    }
}

    public static ListeMembre getAllMembres() {

    ListeMembre liste = new ListeMembre();

    try {
        String url = "jdbc:mysql://localhost:3306/peace?useSSL=false&useUnicode=true";
        Class.forName("com.mysql.cj.jdbc.Driver");
        Connection conn = DriverManager.getConnection(url, "user", "user");

        String sql = "SELECT * FROM utilisateur WHERE type_utilisateur = 'membre'";
        PreparedStatement pstmt = conn.prepareStatement(sql);
        ResultSet rs = pstmt.executeQuery();

        while (rs.next()) {
            int id = rs.getInt("id");
            String email = rs.getString("email");
            String password = rs.getString("password");
            String nom = rs.getString("nom");
            String prenom = rs.getString("prenom");
            int age = rs.getInt("age");
            String bio = rs.getString("bio");

            Membre m = new Membre(
                id,
                email,
                password,
                nom,
                prenom,
                age,
                bio,
                getReponsesByMembreId(id)
            );

            liste.add(m);
        }

        rs.close();
        pstmt.close();
        conn.close();

    } catch (Exception e) {
        e.printStackTrace();
    }

    return liste;
}
    public static void updateMembre(Membre m) {
    try {
        String url = "jdbc:mysql://localhost:3306/peace?useSSL=false&useUnicode=true";
        Class.forName("com.mysql.cj.jdbc.Driver");
        Connection conn = DriverManager.getConnection(url, "user", "user");

        String sql = """
            UPDATE utilisateur
            SET nom = ?, prenom = ?, age = ?, bio = ?
            WHERE id = ?
        """;

        PreparedStatement pstmt = conn.prepareStatement(sql);
        pstmt.setString(1, m.getNom());
        pstmt.setString(2, m.getPrenom());
        pstmt.setInt(3, m.getAge());
        pstmt.setString(4, m.getBio());
        pstmt.setInt(5, m.getId());

        pstmt.executeUpdate();

        pstmt.close();
        conn.close();

    } catch (Exception e) {
        e.printStackTrace();
    }
}
    public static ArrayList<Reponse> getReponsesByQuestionId(int questionId) {
    ArrayList<Reponse> reponses = new ArrayList<>();
    try {
        Statement stmt = Db.connexion();
        String sql = "SELECT r.id, r.texte FROM reponse r WHERE r.id_question = " + questionId;
        ResultSet rs = stmt.executeQuery(sql);

        Question q = new Question(questionId, "", false);

        while (rs.next()) {
            int idReponse = rs.getInt("id");
            String texte = rs.getString("texte");
            Reponse r = new Reponse(idReponse, texte, q); 
            reponses.add(r);
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
    return reponses;
}

    public static void addReponseMembre(int membreId, int reponseId) {
    try {
        String url = "jdbc:mysql://localhost:3306/peace?useSSL=false&useUnicode=true";
        Class.forName("com.mysql.cj.jdbc.Driver");
        Connection conn = DriverManager.getConnection(url, "user", "user");

        String sql = "INSERT INTO membre_reponse (membre_id, reponse_id) VALUES (?, ?)";
        PreparedStatement pstmt = conn.prepareStatement(sql);
        pstmt.setInt(1, membreId);
        pstmt.setInt(2, reponseId);

        pstmt.executeUpdate();

        pstmt.close();
        conn.close();

    } catch (SQLException e) {
        // Cas fréquent : réponse déjà enregistrée (clé primaire)
        System.out.println("Réponse déjà enregistrée pour ce membre.");
    } catch (Exception e) {
        e.printStackTrace();
    }
}

    public static ListeReponse getReponsesByMembreId(int membreId) {
    ListeReponse lr = new ListeReponse();

    try {
        String url = "jdbc:mysql://localhost:3306/peace?useSSL=false&useUnicode=true";
        Class.forName("com.mysql.cj.jdbc.Driver");
        Connection conn = DriverManager.getConnection(url, "user", "user");

        String sql = """
            SELECT r.id, r.texte, r.question_id
            FROM reponse r
            JOIN membre_reponse mr ON r.id = mr.reponse_id
            WHERE mr.membre_id = ?
        """;

        PreparedStatement pstmt = conn.prepareStatement(sql);
        pstmt.setInt(1, membreId);
        ResultSet rs = pstmt.executeQuery();

        while (rs.next()) {
            Question q = new Question(rs.getInt("question_id"), "", false);
            Reponse r = new Reponse(rs.getInt("id"), rs.getString("texte"), q);
            lr.add(r);
        }

        rs.close();
        pstmt.close();
        conn.close();

    } catch (Exception e) {
        e.printStackTrace();
    }

    return lr;
}

    public static void likerMembre(int membreId, int likerId) {
    try {
        String url = "jdbc:mysql://localhost:3306/peace?useSSL=false&useUnicode=true";
        Class.forName("com.mysql.cj.jdbc.Driver");
        Connection conn = DriverManager.getConnection(url, "user", "user");

        String sql = "INSERT INTO like_membre (membre_id, liker_id) VALUES (?, ?)";
        PreparedStatement pstmt = conn.prepareStatement(sql);
        pstmt.setInt(1, membreId);
        pstmt.setInt(2, likerId);
        pstmt.executeUpdate();

        pstmt.close();
        conn.close();

    } catch (SQLException e) {
        // ignore si déjà liké
        System.out.println("Déjà liké.");
    } catch (Exception e) {
        e.printStackTrace();
    }
}

    public static ArrayList<Membre> getLikesRecus(int membreId) {
    ArrayList<Membre> likers = new ArrayList<>();
    try {
        String url = "jdbc:mysql://localhost:3306/peace?useSSL=false&useUnicode=true";
        Class.forName("com.mysql.cj.jdbc.Driver");
        Connection conn = DriverManager.getConnection(url, "user", "user");

        String sql = "SELECT u.* FROM like_membre lm " +
                     "JOIN utilisateur u ON lm.liker_id = u.id " +
                     "WHERE lm.membre_id = ?";
        PreparedStatement pstmt = conn.prepareStatement(sql);
        pstmt.setInt(1, membreId);

        ResultSet rs = pstmt.executeQuery();
        while (rs.next()) {
            Membre m = new Membre(
                rs.getInt("id"),
                rs.getString("email"),
                rs.getString("password"),
                rs.getString("nom"),
                rs.getString("prenom"),
                rs.getInt("age"),
                rs.getString("bio"),
                new ListeReponse()
            );
            likers.add(m);
        }

        rs.close();
        pstmt.close();
        conn.close();

    } catch (Exception e) {
        e.printStackTrace();
    }
    return likers;
}


}
 