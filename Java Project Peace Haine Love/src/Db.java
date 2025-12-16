import java.sql.*;


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
                new ListeReponse()
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
                new ListeReponse()
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

}
 