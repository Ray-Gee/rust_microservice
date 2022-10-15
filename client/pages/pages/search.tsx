import { Card, H1, H3 } from "@blueprintjs/core";
import { GetServerSidePropsContext, NextPage } from "next";
import Link from "next/link";
import { useCallback, useState } from "react";
import { AppNavbar } from "../../components/AppNavbar";
import { Page, PageConnection } from "../../generated/graphql";
import { sdk } from "../../src/client";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { q } = context.query!;
  const data = await sdk.searchPage({ query: q as string });
  const pageConnection = data.searchPage;
  return {
    props: {
      query: q,
      pageConnection,
    },
  };
}

const Search: NextPage<{ pageConnection: PageConnection; query: string }> = ({
  query,
  pageConnection,
}) => {
  const [pageEdges, setPageEdges] = useState(pageConnection.edges!);
  const [hasNextPage, setHasNextPage] = useState(
    pageConnection.pageInfo.hasNextPage
  );
  const handleLoadMoreClick = useCallback(async () => {
    const lastEdge = pageEdges[pageEdges.length - 1];
    const data = await sdk.searchPage({ query, after: lastEdge?.cursor });
    setHasNextPage(data.searchPage.pageInfo.hasNextPage);
    setPageEdges((pageEdges) => {
      return [...pageEdges!, ...(data.searchPage.edges! as any)];
    });
  }, [pageEdges, query]);
  return (
    <>
      <AppNavbar query={query} />
      <div className="mx-auto max-w-screen-md">
        <H1>検索結果</H1>
        <div className="flex flex-col space-y-2">
          {pageEdges.map((edge) => {
            const page = edge?.node!;
            return (
              <Card key={page.id}>
                <H3>
                  <Link href={`/pages/${page.title}`}>{page.title}</Link>
                </H3>
                <p>
                  {page.source.length > 140
                    ? page.source.substring(0, 138) + "...."
                    : page.source}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
      <div className="flex justify-center mt-2">
        <Button disabled={!hasNextPage} onClick={handleLoadMoreClick}>
          もっと読み込む
        </Button>
      </div>
    </>
  );
};

export default Search;
