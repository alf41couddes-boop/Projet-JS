
public class Admin extends Utilisateur{
    
    
    public Admin(int id, String email, String password){
        super(id, email, password);
    }

    public void supprimerMembre(Membre m, ListeMembre lm){
        lm.remove(m);
    }

    public void afficheTousLesMembres(){
        afficheTousLesMembres();
    }
}
