import java.text.DecimalFormat;
import java.util.Scanner;

public class Membre extends Utilisateur {
    private String nom;
    private String prenom;
    private int age;
    private String bio;
    private ListeReponse listeRep;

    public Membre(int id, String nom, String prenom, int age,String bio, ListeReponse listeRep){
        super(id);
        this.nom = nom;
        this.prenom = prenom;
        this.age = age;
        this.bio = bio;
        this.listeRep = new ListeReponse();
    }

    public void remplirProfil(String nom, String prenom, int age, String bio){
        Scanner sc = new Scanner(System.in);
        System.out.println("Quel est votre nom ?");
        nom = sc.nextLine();
        System.out.println("Quel est votre prénom ?");
        prenom = sc.nextLine();
        System.out.println("Quel est votre âge ?");
        age = sc.nextInt();
        System.out.println("Sur Peace Haine Love, la seule chose positive qui vous est accordée de dire est juste ici, dans votre bio :");
        System.out.println("Remplir sa bio :");
        bio = sc.nextLine();
        sc.close();
    }


    public void afficheProfil(){
        System.out.println(prenom + " " +nom);
        System.out.println(age + " ans");
        System.out.println(bio);
    }

    public ListeReponse getListeRep(){
        return listeRep;
    }

    public String comparaison(Membre m){            // le type est string pour conserver un format 
        double compteurComparatif = 0 ;
        DecimalFormat f = new DecimalFormat();      // avec deux chiffres après la virgule
	    f.setMaximumFractionDigits(2);    //
         for (int i = 0; i<listeRep.size(); i++){
            if(listeRep.getRep(i) == m.getListeRep().getRep(i)){
                compteurComparatif++;
            }
        }
        compteurComparatif = (compteurComparatif/listeRep.size())*100;
        return f.format(compteurComparatif);
    }
}
