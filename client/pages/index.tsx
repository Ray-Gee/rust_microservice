import type { GetServerSidePropsContext, NextPage } from "next";
import { Page } from "../generated/graphql";
import { sdk } from "../src/client";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const data = await sdk.getPageByTitle({ title: "Home" });
  const page = data.pageByTitle;
  return {
    props: {
      page,
    },
  };
}

const Home: NextPage<{ page: Page }> = ({ page }) => {
  return (
    <>
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.bodyHtml ?? "" }} />
    </>
  );
};

export default Home;
