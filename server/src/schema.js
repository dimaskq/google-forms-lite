const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type Form {
    id: ID!
    title: String!
    description: String
    showScore: Boolean
    questions: [Question!]!
  }

  type Question {
    id: ID!
    text: String!
    type: String!
    options: [String]
    correctAnswer: String
    points: Int
  }

  input QuestionInput {
    text: String!
    type: String!
    options: [String]
    correctAnswer: String
    points: Int
  }

  type Response {
    id: ID!
    formId: ID!
    answers: [Answer!]!
    score: Int
    maxScore: Int
  }

  type Answer {
    questionId: ID!
    value: String!
  }

  input AnswerInput {
    questionId: ID!
    value: String!
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
      showScore: Boolean
    ): Form!

    updateForm(
      id: ID!
      title: String
      description: String
      questions: [QuestionInput!]
      showScore: Boolean
    ): Form

    deleteForm(id: ID!): Boolean
    submitResponse(formId: ID!, answers: [AnswerInput!]!): Response!
  }
`);
