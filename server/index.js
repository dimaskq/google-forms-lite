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
  }

  input QuestionInput {
    type: String!
    text: String!
    options: [String!]
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
    const response = {
      id: String(responseCounter++),
      formId,
      answers,
    };
    responses.push(response);
    return response;
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
