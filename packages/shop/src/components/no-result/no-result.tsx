import React from "react";
import { useRouter } from "next/router";
import GreenboxSvg from "./green-box-3d.png";
import {
  NoResultWrapper,
  ImageWrapper,
  ButtonWrapper,
} from "./no-result.style";
import { ArrowPrev } from "assets/icons/ArrowPrev";
import { Button } from "components/button/button";
// import { SearchContext } from 'contexts/search/search.context';
import { FormattedMessage } from "react-intl";

type NoResultFoundProps = {
  id?: string;
  forPagination?: boolean;
  prevPagePagination?: () => void;
};

const NoResultFound: React.FC<NoResultFoundProps> = ({
  id,
  forPagination,
  prevPagePagination,
}) => {
  const router = useRouter();
  // const { dispatch } = React.useContext(SearchContext);

  function onClickButton() {
    // dispatch({
    //   type: 'RESET',
    // });
    if (forPagination) {
      prevPagePagination();
      return;
    }
    const href = router.pathname;

    router.push(href, href, { shallow: true });
  }
  return (
    <NoResultWrapper id={id}>
      <h3>
        <FormattedMessage
          id="noResultFound"
          defaultMessage="Sorry, No result found :("
        />
      </h3>

      <ImageWrapper>
        <img src={GreenboxSvg} alt="No Result" />
      </ImageWrapper>

      <ButtonWrapper>
        <div onClick={onClickButton}>
          <Button>
            <ArrowPrev /> Go Back
          </Button>
        </div>
      </ButtonWrapper>
    </NoResultWrapper>
  );
};

export default NoResultFound;
