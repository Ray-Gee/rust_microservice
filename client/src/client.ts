import {
    GraphQLClient
} from "graphql-request";
import { getSdk } from "../generated/graphql";

const endpoint = "http://127.0.0.1:8000/graphql";

const graphQlClient = new GraphQLClient(endpoint);
export const sdk = getSdk(graphQlClient);