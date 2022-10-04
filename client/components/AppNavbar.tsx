import { Alignment, AnchorButton, InputGroup, Navbar } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

export type AppNavbarProps = {
  query?: string;
};

export const AppNavbar: React.VFC<AppNavbarProps> = ({ query }) => {
  return (
    <Navbar fixedToTop>
      <Navbar.Group>
        <Navbar.Heading>
          <Link href="/">Wikit</Link>
        </Navbar.Heading>
      </Navbar.Group>
      <Navbar.Group>
        <SearchBox query={query ?? ""} />
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
        <Link passHref href="/new_page">
          <AnchorButton minimal icon={IconNames.DOCUMENT}>
            新しいページ
          </AnchorButton>
        </Link>
      </Navbar.Group>
    </Navbar>
  );
};

type SearchBoxProps = {
  query: string;
};

const SearchBox: React.VFC<SearchBoxProps> = (props) => {
  const router = useRouter();
  const [query, setQuery] = useState(props.query);
  const handleQueryChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setQuery(e.currentTarget.value);
    },
    []
  );
  const handleSearchBoxSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const params = new URLSearchParams();
      params.append("q", query);
      const search = params.toString();
      router.push(`/search?${search}`);
    },
    [query, router]
  );
  return (
    <form onSubmit={handleSearchBoxSubmit}>
      <InputGroup
        type="search"
        leftIcon={IconNames.SEARCH}
        value={query}
        onChange={handleQueryChange}
        onSubmit={handleSearchBoxSubmit}
      />
    </form>
  );
};
