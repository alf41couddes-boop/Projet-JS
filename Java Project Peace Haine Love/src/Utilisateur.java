
public class Utilisateur {
    private int id;
    private String email;
    private String password;


    public Utilisateur(int id, String email, String password){
        this.id = id;
        this.email = email;
        this.password = password;
    }

    public int getId(){
        return id;
    }

    public boolean rightIds(String givedEmail, String givedPassword){
        if(this.email.equals(givedEmail) && this.password.equals(givedPassword)){
            return true;
        }
        else {
            return false;
        } 
    }
}
