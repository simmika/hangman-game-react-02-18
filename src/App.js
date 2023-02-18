import React from "react";
import { Button, Form, Stack } from "react-bootstrap";
import "./styles.css";

async function getWord() {
  let response = await window.fetch(
    `https://random-word-api.vercel.app/api?words=1`
  );
  let responseJson = await response.json();
  console.log(responseJson[0]);

  return responseJson[0];
}

const Message = ({ guessSuccess, guessesCount, word, guessWord }) => {
  const messageObj = { type: "", message: "" };
  if (guessSuccess === null) {
    messageObj.type = "primary";
    messageObj.message = "Please enter your guess and submit";
  } else if (guessesCount === 6) {
    messageObj.type = "danger";
    messageObj.message = `The word was ${word.toUpperCase()}.`;
    return (
      <div className={`alert alert-${messageObj.type}`} role="alert">
        <h4 className="alert-heading">
          SORRY YOU LOST{" "}
          <span role="img" aria-label="loose">
            👾
          </span>
        </h4>
        <p>
          The word was <strong>{word.toUpperCase()}</strong>. Better luck next
          time!
        </p>
        <hr></hr>
        <p>
          <small>
            If you want to try again, click the <strong>"PLAY AGAIN"</strong>{" "}
            button below.
          </small>
        </p>
      </div>
    );
  } else if (!guessSuccess && guessesCount < 6) {
    messageObj.type = "danger";
    messageObj.message = "Your guess is incorrect.";
  } else if (!guessWord.includes("_")) {
    messageObj.type = "success";
    messageObj.message = `You won the game! The correct word is ${word.toUpperCase()}`;
    return (
      <div className={`alert alert-${messageObj.type}`} role="alert">
        <h4 className="alert-heading">
          CONGRATULATIONS!{" "}
          <span role="img" aria-label="win">
            🏆
          </span>{" "}
        </h4>
        <p>{messageObj.message}</p>
        <hr></hr>
        <p>
          <small>
            If you want to play again, click the <strong>"PLAY AGAIN"</strong>{" "}
            button below.
          </small>
        </p>
      </div>
    );
  } else if (guessSuccess) {
    messageObj.type = "success";
    messageObj.message = "Your guess is correct";
  }
  return (
    <div className={`alert alert-${messageObj.type}`} role="alert">
      {messageObj.message}
    </div>
  );
};

const Img = ({ guessesCount }) => (
  <img
    className=" mx-auto"
    alt=""
    src={`./img/hangman${guessesCount + 1}.png`}
    width="200"
    height="400"
  />
);

const DisplayPlayingApp = ({
  handleLetterSubmit,
  handleLetterChange,
  guessLetter,
  guessSuccess,
  guessWord,
  guessesCount,
  word
}) => {
  return (
    <div className="App">
      <Form onSubmit={handleLetterSubmit}>
        <Stack direction="horizontal" gap={3} className="col-md-8 mx-auto">
          <Form.Control
            onChange={handleLetterChange}
            type="letter"
            placeholder="Your guess"
            size="lg"
            maxLength="1"
            value={guessLetter}
            disabled={!guessWord?.includes("_") || guessesCount === 6}
          />
          <Button
            disabled={!guessLetter}
            variant="primary"
            type="submit"
            size="lg"
          >
            Submit
          </Button>
        </Stack>
      </Form>
      <Stack className="col-md-8 mx-auto" style={{ marginTop: "1rem" }}>
        <Stack>
          <Message
            guessSuccess={guessSuccess}
            guessesCount={guessesCount}
            word={word}
            guessWord={guessWord}
          />
        </Stack>
      </Stack>
      <Stack>
        <h2>{guessWord?.split("").map((x) => x + " ")}</h2>
      </Stack>
      <Stack>
        <Img guessesCount={guessesCount} />
      </Stack>
      <Stack className="col-lg-8 mx-auto">
        <Button variant="danger" onClick={() => window.location.reload(false)}>
          {!guessWord?.includes("_") || guessesCount === 6
            ? "PLAY AGAIN"
            : "RESET"}
        </Button>
      </Stack>
    </div>
  );
};

export default function App() {
  const [word, setWord] = React.useState();
  const [guessLetter, setGuessLetter] = React.useState("");
  const [guessWord, setGuessWord] = React.useState();
  const [guessesCount, setGuessesCount] = React.useState(0);
  const [guessSuccess, setGuessSuccess] = React.useState(null);

  React.useEffect(() => {
    getWord().then((result) => {
      setWord(result);
      setGuessWord("_".repeat(result.length));
    });
  }, []);

  const handleLetterChange = (event) => {
    setGuessLetter(
      event.target.value.toLowerCase().replaceAll(/[^a-zA-Z]+/g, "")
    );
  };

  const handleLetterSubmit = (e) => {
    e.preventDefault();
    if (word.includes(guessLetter)) {
      const gameWord = word
        .split("")
        .map((letter) => (letter !== guessLetter ? "_" : letter));
      setGuessWord(
        gameWord
          .map((x, i) => (guessWord[i] === "_" ? x : guessWord[i]))
          .join("")
      );
      setGuessSuccess(true);
    } else {
      setGuessSuccess(false);
      setGuessesCount((c) => c + 1);
    }
    setGuessLetter("");
  };

  return (
    <DisplayPlayingApp
      handleLetterSubmit={handleLetterSubmit}
      handleLetterChange={handleLetterChange}
      guessLetter={guessLetter}
      guessSuccess={guessSuccess}
      guessWord={guessWord}
      guessesCount={guessesCount}
      word={word}
    />
  );
}
