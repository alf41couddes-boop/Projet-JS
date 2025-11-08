
public class QuestionOuverte extends Question {
    private int type; // type == 1 Question ouverte

    public QuestionOuverte(int idQuestion, String texteQuestion){
        super(idQuestion, texteQuestion);
        this.type = 1;
    }

    
}
