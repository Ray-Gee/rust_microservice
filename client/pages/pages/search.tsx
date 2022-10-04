import { Card, H1, H3 } from "@blueprintjs/core";
import { GetServerSidePropsContext, NextPage } from "next";
import Link from "next/link";
import { AppNavbar } from "../../components/AppNavbar";
import { Page } from "../../generated/graphql";
import { sdk } from "../../src/client";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { q } = context.query!;
  const data = await sdk.searchPage({ query: q as string });
  const pages = data.searchPage;
  return {
    props: {
      query: q,
      pages,
    },
  };
}

const Search: NextPage<{ pages: Page[]; query: string }> = ({
  query,
  pages,
}) => {
  return (
    <>
      <AppNavbar query={query} />
      <div className="mx-auto max-w-screen-md">
        <H1>検索結果</H1>
        <div className="flex flex-col space-y-2">
          {pages.map((page) => {
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
    </>
  );
};

export default Search;
