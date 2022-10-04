import { FormGroup, InputGroup, TextArea } from "@blueprintjs/core";
import { useCallback } from "react";

export type Page = {
  title: string;
  source: string;
};

export type PageEditorProps = {
  page: Page;
  onChange: (page: Page) => void;
};
export const PageEditor: React.FC<PageEditorProps> = ({ page, onChange }) => {
  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...page, title: e.currentTarget.value });
    },
    [onChange, page]
  );
  const handleSourceChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange({ ...page, source: e.target.value });
    },
    [onChange, page]
  );
  return (
    <>
      <FormGroup>
        <InputGroup large={true} value={page.title} onChange={handleTitleChange} />
      </FormGroup>
      <FormGroup>
        <TextArea fill={true} rows={10} onChange={handleSourceChange}>
          {page.source}
        </TextArea>
      </FormGroup>
    </>
  );
};

export default Page;
