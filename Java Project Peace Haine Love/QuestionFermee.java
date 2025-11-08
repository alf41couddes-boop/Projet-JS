
public class QuestionFermee extends Question{
    private int type; // type == 0 Question fermée 

    public QuestionFermee(int idQuestion, String texteQuestion){
        super(idQuestion, texteQuestion);
        this.type = 0;
    }
}
