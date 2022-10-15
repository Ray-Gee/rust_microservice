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
  /**
   * ISO 8601 combined date and time without timezone.
   *
   * # Examples
   *
   * * `2015-07-01T08:59:60.123`,
   */
  NaiveDateTime: any;
};

export type CreatePageInput = {
  source: Scalars['String'];
  title: Scalars['String'];
};

export type DeletePageInput = {
  id: Scalars['Int'];
};

export type DeletedPage = {
  __typename?: 'DeletedPage';
  id: Scalars['Int'];
};

export type GiveHatenaStarInput = {
  color: Scalars['Int'];
  pageId: Scalars['Int'];
  quote?: InputMaybe<Scalars['String']>;
};

export type HatenaStar = {
  __typename?: 'HatenaStar';
  color: Scalars['Int'];
  id: Scalars['Int'];
  pageId: Scalars['Int'];
  quote?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPage: Page;
  deletePage?: Maybe<DeletedPage>;
  giveHatenaStar: HatenaStar;
  updatePage?: Maybe<Page>;
};


export type MutationCreatePageArgs = {
  input: CreatePageInput;
};


export type MutationDeletePageArgs = {
  input: DeletePageInput;
};


export type MutationGiveHatenaStarArgs = {
  input: GiveHatenaStarInput;
};


export type MutationUpdatePageArgs = {
  input: UpdatePageInput;
};

export type Page = {
  __typename?: 'Page';
  bodyHtml: Scalars['String'];
  createTime: Scalars['NaiveDateTime'];
  hatenaStars: Array<HatenaStar>;
  id: Scalars['Int'];
  source: Scalars['String'];
  title: Scalars['String'];
  updateTime: Scalars['NaiveDateTime'];
};

export type PageConnection = {
  __typename?: 'PageConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<PageEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type PageEdge = {
  __typename?: 'PageEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node: Page;
};

/** Information about pagination in a connection */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

export type QueryRoot = {
  __typename?: 'QueryRoot';
  answer: Scalars['Int'];
  imFeelingLucky: Page;
  page?: Maybe<Page>;
  pageByTitle?: Maybe<Page>;
  searchPage: PageConnection;
};


export type QueryRootPageArgs = {
  id: Scalars['Int'];
};


export type QueryRootPageByTitleArgs = {
  title: Scalars['String'];
};


export type QueryRootSearchPageArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
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

export type DeletePageMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeletePageMutation = { __typename?: 'Mutation', deletePage?: { __typename?: 'DeletedPage', id: number } | null };

export type GetPageByTitleQueryVariables = Exact<{
  title: Scalars['String'];
}>;


export type GetPageByTitleQuery = { __typename?: 'QueryRoot', pageByTitle?: { __typename?: 'Page', id: number, title: string, bodyHtml: string, source: string, createTime: any, updateTime: any, hatenaStars: Array<{ __typename?: 'HatenaStar', id: number, quote?: string | null, color: number }> } | null };

export type GiveHatenaStarMutationVariables = Exact<{
  pageId: Scalars['Int'];
  quote?: InputMaybe<Scalars['String']>;
  color: Scalars['Int'];
}>;


export type GiveHatenaStarMutation = { __typename?: 'Mutation', giveHatenaStar: { __typename?: 'HatenaStar', id: number, pageId: number, quote?: string | null, color: number } };

export type ImFeelingLuckyQueryVariables = Exact<{ [key: string]: never; }>;


export type ImFeelingLuckyQuery = { __typename?: 'QueryRoot', imFeelingLucky: { __typename?: 'Page', title: string } };

export type SearchPageQueryVariables = Exact<{
  query: Scalars['String'];
  after?: InputMaybe<Scalars['String']>;
}>;


export type SearchPageQuery = { __typename?: 'QueryRoot', searchPage: { __typename?: 'PageConnection', pageInfo: { __typename?: 'PageInfo', hasPreviousPage: boolean, hasNextPage: boolean }, edges?: Array<{ __typename?: 'PageEdge', cursor: string, node: { __typename?: 'Page', id: number, title: string, source: string } } | null> | null } };

export type UpdatePageMutationVariables = Exact<{
  id: Scalars['Int'];
  title?: InputMaybe<Scalars['String']>;
  source?: InputMaybe<Scalars['String']>;
}>;


export type UpdatePageMutation = { __typename?: 'Mutation', updatePage?: { __typename?: 'Page', id: number, title: string, bodyHtml: string, source: string, createTime: any, updateTime: any } | null };


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
export const DeletePageDocument = gql`
    mutation deletePage($id: Int!) {
  deletePage(input: {id: $id}) {
    id
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
    createTime
    updateTime
    hatenaStars {
      id
      quote
      color
    }
  }
}
    `;
export const GiveHatenaStarDocument = gql`
    mutation giveHatenaStar($pageId: Int!, $quote: String, $color: Int!) {
  giveHatenaStar(input: {pageId: $pageId, quote: $quote, color: $color}) {
    id
    pageId
    quote
    color
  }
}
    `;
export const ImFeelingLuckyDocument = gql`
    query imFeelingLucky {
  imFeelingLucky {
    title
  }
}
    `;
export const SearchPageDocument = gql`
    query searchPage($query: String!, $after: String) {
  searchPage(query: $query, after: $after, first: 1) {
    pageInfo {
      hasPreviousPage
      hasNextPage
    }
    edges {
      cursor
      node {
        id
        title
        source
      }
    }
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
    createTime
    updateTime
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
    deletePage(variables: DeletePageMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeletePageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeletePageMutation>(DeletePageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deletePage');
    },
    getPageByTitle(variables: GetPageByTitleQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetPageByTitleQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetPageByTitleQuery>(GetPageByTitleDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getPageByTitle');
    },
    giveHatenaStar(variables: GiveHatenaStarMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GiveHatenaStarMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<GiveHatenaStarMutation>(GiveHatenaStarDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'giveHatenaStar');
    },
    imFeelingLucky(variables?: ImFeelingLuckyQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ImFeelingLuckyQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ImFeelingLuckyQuery>(ImFeelingLuckyDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'imFeelingLucky');
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