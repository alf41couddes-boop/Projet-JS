import java.util.ArrayList;

public class ListeMembre {
    private ArrayList<Membre> listeMembre ;

    public ListeMembre(){
        this.listeMembre = new ArrayList <Membre> ();
    }

    public ArrayList<Double> listeCompteurComparatif(Membre m){ //algo de recommandation
        ArrayList<Double> listeCompteurComparatif = new ArrayList<>();
        for (int i = 0;i<listeMembre.size();i++){
            listeCompteurComparatif.add(i,m.comparaison(listeMembre.get(i)));
        }
        return listeCompteurComparatif;
    }

    public void remove(Membre m){
        listeMembre.remove(listeMembre.indexOf(m));
    }

    public void afficheTousLesMembres(){
        for (Membre m : listeMembre){
            m.afficheProfil();
        }
    }
}
