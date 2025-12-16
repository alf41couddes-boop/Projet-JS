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

    public void afficheListeCompteurComparatif(Membre m){
        ArrayList<Double> listeCompteurComparatif = listeCompteurComparatif(m);
        for (int i = 0;i<listeCompteurComparatif.size();i++){
            System.out.println("Comparaison entre " + m.getId() + " et " + listeMembre.get(i).getId() + " : " + listeCompteurComparatif.get(i) + "%");
        }
    }

    public ArrayList<Integer> triListeCompteurComparatif(Membre m){
        ArrayList<Double> listeCompteurComparatif = listeCompteurComparatif(m);
        ArrayList<Integer> indices = new ArrayList<>();
        for (int i = 0; i < listeMembre.size(); i++) {
            if (listeMembre.get(i).getId() != m.getId()) {
                indices.add(i);
            }
        }
        indices.sort((i1, i2) -> Double.compare(listeCompteurComparatif.get(i2), listeCompteurComparatif.get(i1)));

        ArrayList<Integer> sortedIds = new ArrayList<>();
        for (int j : indices) {
            sortedIds.add(listeMembre.get(j).getId());
        }

        return sortedIds;
    }

    public void afficheListeCompteurComparatifTriee(Membre m){
        ArrayList<Integer> sortedIds = triListeCompteurComparatif(m);
        ArrayList<Double> listeComp = listeCompteurComparatif(m);

        for (int id : sortedIds) {

            for (int i = 0; i < listeMembre.size(); i++) {
                if (listeMembre.get(i).getId() == id) {
                    System.out.println("Comparaison entre " + m.getId() + " et " + id + " : " + listeComp.get(i) + "%");
                    
                }
            }
        }
    }

    public void add(Membre m){
        listeMembre.add(m);
    }

    public void remove(Membre m){
        listeMembre.remove(listeMembre.indexOf(m));
    }

    public void afficheTousLesMembres(){
        for (Membre m : listeMembre){
            m.afficheProfil();
        }
    }

    public ArrayList<Membre> getMembres() {
        return listeMembre;
    }
}
