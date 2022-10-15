import {
  Button,
  Divider,
  FormGroup,
  H1,
  InputGroup,
  Intent,
  TextArea,
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { Tooltip2 } from "@blueprintjs/popover2";
import type { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { AppNavbar } from "../../components/AppNavbar";
import PageEditor from "../../components/PageEditor";
import { Page } from "../../generated/graphql";
import { sdk } from "../../src/client";
import { HatenaStarColorMap } from "../../src/hatena_star";

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
  const router = useRouter();
  const [page, setPage] = useState(props.page);
  const [hatenaStars, setHatenaStars] = useState(page.hatenaStars);
  const [isEditing, setIsEditing] = useState(false);
  const handleOpenEditor = useCallback(() => {
    setIsEditing(true);
  }, []);
  const handleDeleteButtonClick = useCallback(async () => {
    await sdk.deletePage({ id: page.id });
    router.push("/");
  }, [page.id, router]);
  const handleCancelEditor = useCallback(() => {
    setIsEditing(false);
  }, []);
  const handleUpdateEditor = useCallback((page: Page) => {
    setPage(page);
    setIsEditing(false);
  }, []);
  const handleGiveHatenaStarClick = useCallback(
    async (color) => {
      const selection = window.getSelection();
      const quote = selection?.isCollapsed ? null : selection?.toString();
      const data = await sdk.giveHatenaStar({ pageId: page.id, quote, color });
      const newHatenaStar = data.giveHatenaStar;
      setHatenaStars((hatenaStars) => {
        return [...hatenaStars, newHatenaStar];
      });
    },
    [page.id]
  );
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
              <div className="flex space-x-2">
                <Button onClick={handleOpenEditor} icon={IconNames.EDIT}>
                  編集
                </Button>
                <Button
                  intent={Intent.DANGER}
                  onClick={handleDeleteButtonClick}
                  icon={IconNames.TRASH}
                >
                  削除
                </Button>
              </div>
            </div>
            <article className="markdown-body">
              <div dangerouslySetInnerHTML={{ __html: page.bodyHtml ?? "" }} />
            </article>
            <Divider />
            <div className="flex flex-wrap items-center">
              {Array.from(HatenaStarColorMap.entries()).map(
                ([colorCode, textColor]) => {
                  <Button
                    key={colorCode}
                    minimal
                    onClick={() => handleGiveHatenaStarClick(textColor)}
                  >
                    <span className={textColor}>★</span>
                  </Button>;
                }
              )}
              {hatenaStars.map(({ id, quote, color }) => {
                const textColor = HatenaStarColorMap.get(color)!;
                return (
                  <Tooltip2 content={quote ?? undefined} key={id}>
                    <span className={`${textColor} cursor-default`}>★</span>
                  </Tooltip2>
                );
              })}
            </div>
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
    onUpdate(data.updatePage as any);
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
      <Divider />
    </>
  );
};

export default Page;
