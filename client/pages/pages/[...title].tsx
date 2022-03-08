import type { GetServerSidePropsContext, NextPage } from "next";
import { Page } from "../../generated/graphql";
import { sdk } from "../../src/client";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { title } = context.params!;
  const titleString = (title as string[]).join("/");
  const data = await sdk.getPageByTitle({ title: titleString });
  const page = data.pageByTitle;
  return {
    props: {
      page,
    },
  };
}

const Page: NextPage<{ page: Page }> = ({ page }) => {
  return (
    <>
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.bodyHtml ?? "" }} />
    </>
  );
};

export default Page;
