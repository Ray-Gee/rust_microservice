import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreatePageInput = {
  source: Scalars['String'];
  title: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPage: Page;
  updatePage?: Maybe<Page>;
};


export type MutationCreatePageArgs = {
  input: CreatePageInput;
};


export type MutationUpdatePageArgs = {
  input: UpdatePageInput;
};

export type Page = {
  __typename?: 'Page';
  bodyHtml: Scalars['String'];
  id: Scalars['Int'];
  source: Scalars['String'];
  title: Scalars['String'];
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  answer: Scalars['Int'];
  page?: Maybe<Page>;
  pageByTitle?: Maybe<Page>;
  searchPage: Array<Page>;
};


export type QueryRootPageArgs = {
  id: Scalars['Int'];
};


export type QueryRootPageByTitleArgs = {
  title: Scalars['String'];
};


export type QueryRootSearchPageArgs = {
  query: Scalars['String'];
};

export type UpdatePageInput = {
  id: Scalars['Int'];
  source?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type CreatePageMutationVariables = Exact<{
  title: Scalars['String'];
  source: Scalars['String'];
}>;


export type CreatePageMutation = { __typename?: 'Mutation', createPage: { __typename?: 'Page', id: number, title: string, bodyHtml: string, source: string } };

export type GetPageByTitleQueryVariables = Exact<{
  title: Scalars['String'];
}>;


export type GetPageByTitleQuery = { __typename?: 'QueryRoot', pageByTitle?: { __typename?: 'Page', id: number, title: string, bodyHtml: string, source: string } | null };

export type SearchPageQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type SearchPageQuery = { __typename?: 'QueryRoot', searchPage: Array<{ __typename?: 'Page', id: number, title: string, source: string }> };

export type UpdatePageMutationVariables = Exact<{
  id: Scalars['Int'];
  title?: InputMaybe<Scalars['String']>;
  source?: InputMaybe<Scalars['String']>;
}>;


export type UpdatePageMutation = { __typename?: 'Mutation', updatePage?: { __typename?: 'Page', id: number, title: string, bodyHtml: string, source: string } | null };


export const CreatePageDocument = gql`
    mutation createPage($title: String!, $source: String!) {
  createPage(input: {title: $title, source: $source}) {
    id
    title
    bodyHtml
    source
  }
}
    `;
export const GetPageByTitleDocument = gql`
    query getPageByTitle($title: String!) {
  pageByTitle(title: $title) {
    id
    title
    bodyHtml
    source
  }
}
    `;
export const SearchPageDocument = gql`
    query searchPage($query: String!) {
  searchPage(query: $query) {
    id
    title
    source
  }
}
    `;
export const UpdatePageDocument = gql`
    mutation updatePage($id: Int!, $title: String, $source: String) {
  updatePage(input: {id: $id, title: $title, source: $source}) {
    id
    title
    bodyHtml
    source
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    createPage(variables: CreatePageMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreatePageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreatePageMutation>(CreatePageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createPage');
    },
    getPageByTitle(variables: GetPageByTitleQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetPageByTitleQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetPageByTitleQuery>(GetPageByTitleDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getPageByTitle');
    },
    searchPage(variables: SearchPageQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SearchPageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchPageQuery>(SearchPageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'searchPage');
    },
    updatePage(variables: UpdatePageMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdatePageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdatePageMutation>(UpdatePageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updatePage');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;