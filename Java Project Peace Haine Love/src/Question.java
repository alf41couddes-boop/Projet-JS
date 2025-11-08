

import java.util.ArrayList;

public class Question {
    private int idQuestion;
    private String texteQuestion;
    private boolean ouverte;
    private ArrayList<Reponse> repPossible;
    
    public Question(int idQuestion, String texte, boolean ouverte){
        this.idQuestion = idQuestion;
        this.texteQuestion = texte;
        this.ouverte = ouverte;
        this.repPossible = new ArrayList<Reponse>(); 
        /* 
        if (ouverte==true){
            new Reponse(1, "r1"+idQuestion, "Oui");
            new Reponse(1, "r2"+idQuestion, "Oui");
        }
            */
    }

    public int getIdQuestion(){
        return idQuestion;
    }

    public void afficheQuestion(){
        System.out.println(texteQuestion);
    }

    public void afficheRepPossible(){
        for (int i = 0; i<repPossible.size(); i++){
            System.out.println("Reponse "+repPossible.get(i)+" -> "+repPossible);
        }
    }

    public boolean ouverte(){
        if (ouverte==true){
            return true;
        }
        else 
        return false;
    }
}
