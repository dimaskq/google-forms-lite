import { createApi } from "@reduxjs/toolkit/query/react";
import { gql, request } from "graphql-request";

const BASE_URL = import.meta.env.VITE_API_URL;
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
  tagTypes: ["Form", "Response"],
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
      providesTags: ["Form"],
    }),

    getForm: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        document: gql`
          query ($id: ID!) {
            form(id: $id) {
              id
              title
              description
              showScore
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
      providesTags: (_res, _err, arg) => [{ type: "Form", id: arg.id }],
    }),

    createForm: builder.mutation<any, any>({
      query: ({ title, description, questions, showScore }) => ({
        document: gql`
          mutation (
            $title: String!
            $description: String
            $questions: [QuestionInput!]!
            $showScore: Boolean
          ) {
            createForm(
              title: $title
              description: $description
              questions: $questions
              showScore: $showScore
            ) {
              id
              title
              description
              showScore
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
        variables: { title, description, questions, showScore },
      }),
      invalidatesTags: ["Form"],
    }),

    updateForm: builder.mutation<any, any>({
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
            }
          }
        `,
        variables: { id, title, description, questions },
      }),
      invalidatesTags: (_res, _err, arg) => [
        "Form",
        { type: "Form", id: arg.id },
      ],
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
      invalidatesTags: ["Form"],
    }),

    submitResponse: builder.mutation<any, { formId: string; answers: any[] }>({
      query: ({ formId, answers }) => ({
        document: gql`
          mutation ($formId: ID!, $answers: [AnswerInput!]!) {
            submitResponse(formId: $formId, answers: $answers) {
              id
              formId
              score
              maxScore
            }
          }
        `,
        variables: { formId, answers },
      }),
      transformResponse: (response: any) => response.submitResponse,
      invalidatesTags: (_res, _err, arg) => [
        { type: "Response", id: arg.formId },
      ],
    }),

    getResponses: builder.query<any, { formId: string }>({
      query: ({ formId }) => ({
        document: gql`
          query ($formId: ID!) {
            responses(formId: $formId) {
              id
              formId
              score
              maxScore
              answers {
                questionId
                value
              }
            }
          }
        `,
        variables: { formId },
      }),
      providesTags: (result, _error, arg) =>
        result
          ? [
              ...result.responses.map((_r: any) => ({
                type: "Response" as const,
                id: arg.formId,
              })),
              { type: "Response", id: arg.formId },
            ]
          : [{ type: "Response", id: arg.formId }],
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
