import { Button, Intent } from "@blueprintjs/core";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { AppNavbar } from "../components/AppNavbar";
import { PageEditor, PartialPage } from "../components/PageEditor";
import { Page as Page } from "../generated/graphql";
import { sdk } from "../src/client";

const Page: NextPage = () => {
  const router = useRouter();
  const handleCreatePageButtonClick = (page: Page) => {
    router.push(`/pages/${page.title}`);
  };
  return (
    <>
      <AppNavbar />
      <div className="mx-auto max-w-screen-md">
        <NewPageForm onCreate={handleCreatePageButtonClick} />
      </div>
    </>
  );
};

type NewPageFormProps = {
  onCreate: (newPage: Page) => void;
};
const NewPageForm: React.FC<NewPageFormProps> = ({ onCreate }) => {
  const [page, setPage] = useState({ title: "", source: "" });

  const handleCreateButtonClick = useCallback(async () => {
    const data = await sdk.createPage(page);
    onCreate(data.createPage);
  }, [onCreate, page]);

  const handlePageChange = useCallback(
    (partialPage: PartialPage) => {
      setPage({ ...page, ...partialPage });
    },
    [page]
  );
  return (
    <>
      <PageEditor page={page} onChange={handlePageChange} />
      <div className="flex space-x-2">
        <Button intent={Intent.SUCCESS} onClick={handleCreateButtonClick}>
          作成
        </Button>
      </div>
    </>
  );
};

export default Page;
