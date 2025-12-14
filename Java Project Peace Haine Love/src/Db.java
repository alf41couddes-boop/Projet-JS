import java.sql.*;


public class Db {
    private static Connection conn = null;
    private static Statement stmt = null;
public static Statement connexion() {

    try {
        String url = "jdbc:mysql://localhost:3306/peace?useSSL=false&useUnicode=true";
        Class.forName("com.mysql.cj.jdbc.Driver");
        Connection com = DriverManager.getConnection(url,"user","user");
        System.out.println("connexion réussi");
        
        Statement stmt=com.createStatement();  
        return stmt;
    }
    catch (Exception e) 
    {
        e.printStackTrace();
        System.out.println("Erreur");
        System.exit(0);
        return null;
    }
}

}

 