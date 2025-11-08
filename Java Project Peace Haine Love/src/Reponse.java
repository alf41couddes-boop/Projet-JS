
public class Reponse {
    private double idReponse;
    private String texteReponse;
    private Question questionAssociee;

    public Reponse(double idReponse, String texteReponse, Question questionAssociee){
        this.idReponse = idReponse;
        this.texteReponse = texteReponse;
        this.questionAssociee = questionAssociee;
    }

    public Question getQuestion(){
        return questionAssociee;
    }

    public String getTexteRep(){
        return texteReponse;
    }

    public void afficheRep(){
        System.out.println(texteReponse);
    }

    public String toString(){
        String s = texteReponse + idReponse + questionAssociee;
        return s;
    }

    public double getIdReponse(){
        return idReponse;
    }

}
