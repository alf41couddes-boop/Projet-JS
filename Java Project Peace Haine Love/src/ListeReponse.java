
import java.util.ArrayList;
public class ListeReponse {
    private ArrayList<Reponse> listeRep ;

    public ListeReponse(){
        this.listeRep = new ArrayList <Reponse> ();
    }

    public void afficheListeRep(){
        
        for(int i = 0; i < size();i++){
            System.out.println("idQuestion : "+getRep(i).getQuestion().getIdQuestion() + "\n"
            +
            " | idReponse : "+ getRep(i).getIdReponse()
            +
            " texteReponse : "+ getRep(i).getTexteRep() + "\n");
        } 
    }

    public void selection(Reponse r){  
            listeRep.add(r.getQuestion().getIdQuestion(),r);
    }

    public void add(Reponse r){
        listeRep.add(r);
    }

    public Reponse getRep(int i){
        return listeRep.get(i);
    }

    public void setRep(int i, Reponse r){
        listeRep.set(i,r);
    }

    public int size(){
        return listeRep.size();
    }
    /* 
    public ListeReponse getRepFromAnIdQuestion(Question q, Reponse r){
        int idQuestion = q.getIdQuestion();
        ArrayList<Reponse> listeRepFromAnIdQuestion = new ArrayList<Reponse>();
        for(int i = 0 ; i<listeRep.size();i++){
            if(idQuestion == (int) r.getIdReponse()){
                listeRepFromAnIdQuestion.set(i,r);

            }
        }
        ListeReponse listeFinale;
        for(int i = 0 ; i<listeRepFromAnIdQuestion.size();i++){
                listeFinale.setRep(i, listeRepFromAnIdQuestion.get(i));          
            }
        
        return listeFinale;
        
    }*/
}
