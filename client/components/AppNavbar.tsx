import { Alignment, AnchorButton, InputGroup, Navbar } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { sdk } from "../src/client";

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
            ページを作る
          </AnchorButton>
        </Link>
        <imFeelingLucky />
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

const ImFeelingLuckyButton: React.VFC = () => {
  const handleClick = useCallback(async () => {
    const data = await sdk.imFeelingLucky();
    const title = data.imFeelingLucky.title;
    // router.push({
    //   pathname: "/pages/[title]",
    //   query: { title },
    // });
    location.href = `/pages/${title}`;
  }, []);
  return (
    <Button minimal onClick={handleClick}>
      I&apos;m Feeling Lucky
    </Button>
  );
};
