import logoImg from "../assets/images/logo.svg";
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import "../styles/room.scss";
import { useParams } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";

type RoomParams = {
  id: string;
};

type FirebaseQuestions = Record<string, {
  author:{
    name: string;
    avatar: string;
  }
  content: {
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
  }
}>

type Question ={
  id: string;
  author:{
    name: string;
    avatar: string;
  }
  content: {
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
  }
}

export function Room() {
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState("");
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([])
  const [title, setTitle] = useState('')


  const roomId = params.id;

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on("value", room =>{
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) =>{
        return{
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.content.isHighlighted,
          isAnswered: value.content.isAnswered,
        }
      })
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    })
   
  },[roomId])

  async function handleSendNewQuestion(event: FormEvent) {
    event.preventDefault();
    if (newQuestion.trim() === "") {
      return;
    }

    if (!user) {
      throw new Error("Você precisa estar logado");
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion('')
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="logo" />
          <div>
            <RoomCode code={params.id} />
          </div>
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {console.log(questions.length)}
          {questions.length >0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendNewQuestion}>
          <textarea
            placeholder="O que você quer Perguntar?"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />
          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para Enviar uma pergunta faça seu{" "}
                <button>Faça seu login</button>
              </span>
            )}

            <Button type="submit" disabled={!user}>
              Enviar Pergunta
            </Button>
          </div>
        </form>

        {JSON.stringify(questions)}
      </main>
    </div>
  );
}
