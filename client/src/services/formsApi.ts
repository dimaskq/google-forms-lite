import { createApi } from "@reduxjs/toolkit/query/react";
import { gql, request } from "graphql-request";

const BASE_URL = "http://localhost:4000/graphql";

const graphqlBaseQuery =
  ({ baseUrl }: { baseUrl: string }) =>
  async ({ document, variables }: { document: string; variables?: any }) => {
    try {
      const data = await request(baseUrl, document, variables);
      return { data };
    } catch (error: any) {
      return {
        error: {
          status: error.response?.status || "CUSTOM_ERROR",
          data: error,
        },
      };
    }
  };

export const formsApi = createApi({
  reducerPath: "formsApi",
  baseQuery: graphqlBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getForms: builder.query<any, void>({
      query: () => ({
        document: gql`
          query {
            forms {
              id
              title
              description
            }
          }
        `,
      }),
    }),

    getForm: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        document: gql`
          query ($id: ID!) {
            form(id: $id) {
              id
              title
              description
              questions {
                id
                text
                type
                options
                correctAnswer
                points
              }
            }
          }
        `,
        variables: { id },
      }),
    }),

    createForm: builder.mutation<
      any,
      {
        title: string;
        description?: string;
        questions: {
          text: string;
          type: string;
          options?: string[];
          correctAnswer?: string;
          points?: number;
        }[];
      }
    >({
      query: ({ title, description, questions }) => ({
        document: gql`
          mutation (
            $title: String!
            $description: String
            $questions: [QuestionInput!]!
          ) {
            createForm(
              title: $title
              description: $description
              questions: $questions
            ) {
              id
              title
              description
              questions {
                id
                text
                type
                options
                correctAnswer
                points
              }
            }
          }
        `,
        variables: { title, description, questions },
      }),
    }),

    updateForm: builder.mutation<
      any,
      {
        id: string;
        title?: string;
        description?: string;
        questions?: {
          text: string;
          type: string;
          options?: string[];
          correctAnswer?: string;
          points?: number;
        }[];
      }
    >({
      query: ({ id, title, description, questions }) => ({
        document: gql`
          mutation (
            $id: ID!
            $title: String
            $description: String
            $questions: [QuestionInput!]
          ) {
            updateForm(
              id: $id
              title: $title
              description: $description
              questions: $questions
            ) {
              id
              title
              description
              questions {
                id
                text
                type
                options
                correctAnswer
                points
              }
            }
          }
        `,
        variables: { id, title, description, questions },
      }),
    }),

    deleteForm: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        document: gql`
          mutation ($id: ID!) {
            deleteForm(id: $id)
          }
        `,
        variables: { id },
      }),
    }),

    submitResponse: builder.mutation<
      any,
      { formId: string; answers: { questionId: string; value: string }[] }
    >({
      query: ({ formId, answers }) => ({
        document: gql`
          mutation ($formId: ID!, $answers: [AnswerInput!]!) {
            submitResponse(formId: $formId, answers: $answers) {
              id
              formId
              answers {
                questionId
                value
              }
            }
          }
        `,
        variables: { formId, answers },
      }),
    }),

    getResponses: builder.query<any, { formId: string }>({
      query: ({ formId }) => ({
        document: gql`
          query ($formId: ID!) {
            responses(formId: $formId) {
              id
              score
              answers {
                questionId
                value
              }
            }
          }
        `,
        variables: { formId },
      }),
    }),
  }),
});

export const {
  useGetFormsQuery,
  useGetFormQuery,
  useCreateFormMutation,
  useUpdateFormMutation,
  useDeleteFormMutation,
  useSubmitResponseMutation,
  useGetResponsesQuery,
} = formsApi;
