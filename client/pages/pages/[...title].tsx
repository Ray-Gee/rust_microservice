import {
  Button,
  FormGroup,
  H1,
  InputGroup,
  Intent,
  TextArea,
} from "@blueprintjs/core";
import type { GetServerSidePropsContext, NextPage } from "next";
import { useCallback, useState } from "react";
import { AppNavbar } from "../../components/AppNavbar";
import PageEditor from "../../components/PageEditor";
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

const Page: NextPage<{ page: Page }> = (props) => {
  const [page, setPage] = useState(props.page);
  const [isEditing, setIsEditing] = useState(false);
  const handleOpenEditor = useCallback(() => {
    setIsEditing(true);
  }, []);
  const handleCancelEditor = useCallback(() => {
    setIsEditing(false);
  }, []);
  const handleUpdateEditor = useCallback((page: Page) => {
    setPage(page);
    setIsEditing(false);
  }, []);

  return (
    <>
      <AppNavbar />
      <div className="mx-auto max-w-screen-md">
        {isEditing ? (
          <PageEditor
            page={page}
            onCancel={handleCancelEditor}
            onUpdate={handleUpdateEditor}
          />
        ) : (
          <>
            <div className="flex">
              <H1 className="flex-1">{page.title}</H1>
              <div>
                <Button onClick={handleOpenEditor}>編集</Button>
              </div>
            </div>
            <article className="markdown-body">
              <div dangerouslySetInnerHTML={{ __html: page.bodyHtml ?? "" }} />
            </article>
          </>
        )}
      </div>
    </>
  );
};

type PageFormProps = {
  page: Page;
  onCancel: () => void;
  onUpdate: (newPage: Page) => void;
};
const PageForm: React.FC<PageFormProps> = ({
  onCancel,
  onUpdate,
  ...props
}) => {
  const [page, setPage] = useState(props.page);
  const handleSaveButtonClick = useCallback(async () => {
    const data = await sdk.updatePage({
      id: page.id,
      title: page.title,
      source: page.source,
    });
    onUpdate(data.updatePage!);
  }, [onUpdate, page]);
  const handlePageChange = useCallback((page: Page) => {
    setPage(page);
  }, []);
  return (
    <>
      <PageEditor page={page} onChange={handlePageChange} />
      <div className="flex space-x-2">
        <Button intent={Intent.PRIMARY}>キャンセル</Button>
        <Button intent={Intent.PRIMARY} onClick={handleSaveButtonClick}>
          保存
        </Button>
      </div>
    </>
  );
};

export default Page;
