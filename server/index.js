const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

// --- GraphQL schema ---
const schema = buildSchema(`
  type Question {
    id: ID!
    type: String!
    text: String!
    options: [String!]
    correctAnswer: String
    points: Int
  }

  input QuestionInput {
    type: String!
    text: String!
    options: [String!]
    correctAnswer: String
    points: Int
  }

  type Form {
    id: ID!
    title: String!
    description: String
    questions: [Question!]!
  }

  type Answer {
    questionId: ID!
    value: String!
  }

  input AnswerInput {
    questionId: ID!
    value: String!
  }

type Response {
  id: ID!
  formId: ID!
  answers: [Answer!]!
  score: Int
}

  type Query {
    forms: [Form!]!
    form(id: ID!): Form
    responses(formId: ID!): [Response!]!
  }

  type Mutation {
    createForm(
      title: String!
      description: String
      questions: [QuestionInput!]!
    ): Form
    submitResponse(
      formId: ID!
      answers: [AnswerInput!]!
    ): Response
    deleteForm(id: ID!): Boolean
    updateForm(
      id: ID!
      title: String
      description: String
      questions: [QuestionInput!]
    ): Form
  }
`);

// --- In-memory storage ---
const forms = [];
const responses = [];
let formCounter = 1;
let questionCounter = 1;
let responseCounter = 1;

// --- Resolvers ---
const root = {
  forms: () => forms,

  form: ({ id }) => forms.find((f) => f.id === id),

  responses: ({ formId }) => responses.filter((r) => r.formId === formId),

  createForm: ({ title, description, questions }) => {
    const form = {
      id: String(formCounter++),
      title,
      description,
      questions: questions.map((q) => ({
        id: String(questionCounter++),
        ...q,
      })),
    };
    forms.push(form);
    return form;
  },

  submitResponse: ({ formId, answers }) => {
    const form = forms.find((f) => f.id === formId);
    if (!form) throw new Error("Form not found");

    let score = 0;

    form.questions.forEach((q) => {
      const userAnswer = answers.find((a) => a.questionId === q.id);
      if (!userAnswer) return;

      if (q.correctAnswer) {
        if (q.type === "CHECKBOX") {
          // the correct answer may be several commas apart
          const correct = q.correctAnswer.split(",").map((s) => s.trim());
          const given = userAnswer.value.split(",").map((s) => s.trim());
          const isCorrect =
            correct.length === given.length &&
            correct.every((c) => given.includes(c));
          if (isCorrect) score += q.points || 0;
        } else {
          if (userAnswer.value.trim() === q.correctAnswer.trim()) {
            score += q.points || 0;
          }
        }
      }
    });

    const response = {
      id: String(responseCounter++),
      formId,
      answers,
      score,
    };
    responses.push(response);
    return response;
  },

  deleteForm: ({ id }) => {
    const index = forms.findIndex((f) => f.id === id);
    if (index === -1) return false;
    forms.splice(index, 1);
    return true;
  },

  updateForm: ({ id, title, description, questions }) => {
    const form = forms.find((f) => f.id === id);
    if (!form) return null;

    if (title !== undefined) form.title = title;
    if (description !== undefined) form.description = description;
    if (questions !== undefined) {
      form.questions = questions.map((q) => ({
        id: String(questionCounter++),
        ...q,
      }));
    }
    return form;
  },
};

// --- Server setup ---
const app = express();
app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log("🚀 GraphQL server running at http://localhost:4000/graphql");
});
