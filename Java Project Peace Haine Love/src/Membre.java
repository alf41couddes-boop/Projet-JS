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

    public double comparaison(Membre autre) {

    if (this.listeRep.size() == 0 || autre.getListeRep().size() == 0) {
        return 0;
    }

    int commun = 0;
    int total = 0;

    for (int i = 0; i < this.listeRep.size(); i++) {
        Reponse r1 = this.listeRep.getRep(i);

        for (int j = 0; j < autre.getListeRep().size(); j++) {
            Reponse r2 = autre.getListeRep().getRep(j);

            // même question
            if (r1.getQuestion().getIdQuestion() == r2.getQuestion().getIdQuestion()) {
                total++;
                // même réponse
                if (r1.getIdReponse() == r2.getIdReponse()) {
                    commun++;
                }
                break;
            }
        }
    }

    if (total == 0) return 0;

    return Math.floor((commun * 100.0) / total);
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
