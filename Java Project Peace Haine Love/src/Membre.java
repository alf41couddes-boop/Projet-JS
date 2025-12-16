import java.util.Scanner;

public class Membre extends Utilisateur {
    private String nom;
    private String prenom;
    private int age;
    private String bio;
    private String email;
    private String password;
    private ListeReponse listeRep;

    public Membre(int id, String email, String password, String nom, String prenom, int age,String bio, ListeReponse listeRep){
        super(id, email, password);
        this.email = email;
        this.password = password;
        this.nom = nom;
        this.prenom = prenom;
        this.age = age;
        this.bio = bio;
        this.listeRep = listeRep;
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

    public double comparaison(Membre m){
        double compteurComparatif = 0 ;
         for (int i = 0; i<listeRep.size(); i++){   
            if(listeRep.getRep(i) == m.getListeRep().getRep(i)){
                compteurComparatif++;
            }
        }
        compteurComparatif = (compteurComparatif/listeRep.size())*100;
        return Math.floor(compteurComparatif);
    }

    public String getNom() {
        return nom;
    }
    public String getPrenom() {
        return prenom;
    }
    public int getAge() {
        return age;
    }
    public String getBio() {
        return bio;
    }

        public void setNom(String nom) {
        this.nom = nom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

}
