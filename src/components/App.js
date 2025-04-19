import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);

  // Fetch questions when 'View Questions' is clicked
  useEffect(() => {
    if (page === "List") {
      fetch("http://localhost:4000/questions")
        .then((response) => response.json())
        .then((data) => setQuestions(data))
        .catch((error) => console.error("Error fetching questions:", error));
    }
  }, [page]);

  // Handle question deletion
  function handleDelete(id) {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Update state to remove deleted question
          setQuestions(questions.filter((question) => question.id !== id));
        }
      })
      .catch((error) => console.error("Error deleting question:", error));
  }

  // Handle updating the correct answer
  function handleUpdateCorrectIndex(id, correctIndex) {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correctIndex }),
    })
      .then((response) => response.json())
      .then((updatedQuestion) => {
        // Update state to reflect the updated question
        setQuestions((prevQuestions) =>
          prevQuestions.map((question) =>
            question.id === id ? updatedQuestion : question
          )
        );
      })
      .catch((error) => console.error("Error updating question:", error));
  }

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      <button onClick={() => setPage("List")}>View Questions</button>

      {page === "Form" ? (
        <QuestionForm />
      ) : (
        <QuestionList
          questions={questions}
          onDelete={handleDelete}
          onUpdateCorrectIndex={handleUpdateCorrectIndex} // Pass onUpdateCorrectIndex to QuestionList
        />
      )}
    </main>
  );
}

export default App;
