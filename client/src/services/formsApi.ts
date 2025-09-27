import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { gql, request } from "graphql-request";

const BASE_URL = "http://localhost:4000/graphql";

// Кастомний baseQuery для GraphQL
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
    createForm: builder.mutation<any, { title: string; description?: string }>({
      query: ({ title, description }) => ({
        document: gql`
          mutation ($title: String!, $description: String) {
            createForm(
              title: $title
              description: $description
              questions: []
            ) {
              id
              title
            }
          }
        `,
        variables: { title, description },
      }),
    }),
  }),
});

export const { useGetFormsQuery, useCreateFormMutation } = formsApi;
