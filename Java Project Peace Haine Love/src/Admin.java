
public class Admin extends Utilisateur{

    public Admin(int id){
        super(id);
    }

    public void supprimerMembre(Membre m, ListeMembre lm){
        lm.remove(m);
    }

    public void afficheTousLesMembres(){
        afficheTousLesMembres();
    }
}
