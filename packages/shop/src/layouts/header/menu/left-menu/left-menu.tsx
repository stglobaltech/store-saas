import React, { useEffect } from "react";
import Router, { useRouter } from "next/router";
import { FormattedMessage } from "react-intl";
import Popover from "components/popover/popover";
import Logo from "layouts/logo/logo";
import { MenuDown } from "assets/icons/MenuDown";
import * as categoryMenuIcons from "assets/icons/category-menu-icons";
import {
  MainMenu,
  IconWrapper,
  MenuItem,
  SelectedItem,
  Icon,
  Arrow,
  LeftMenuBox,
} from "./left-menu.style";
import { useAppState } from "contexts/app/app.provider";
import { getStoreId, setStoreId } from "utils/localStorage";

const CategoryIcon = ({ name }) => {
  const TagName = categoryMenuIcons[name];
  return !!TagName ? <TagName /> : <p>Invalid icon {name}</p>;
};

const CategoryMenu = ({ branches, ...props }: any) => {
  const handleOnClick = (item) => {
    // if (item.dynamic) {
    //   Router.push("/[type]", `${item.href}`);
    //   props.onClick(item);
    //   return;
    // }
    // Router.push(`${item.href}`);
    props.onClick(item);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {branches.map((item) => (
        <MenuItem key={item._id} {...props} onClick={() => handleOnClick(item)}>
          {/* <IconWrapper>
            <CategoryIcon name={item.icon} />
          </IconWrapper> */}
          <FormattedMessage id={item._id} defaultMessage={item.name.en} />
        </MenuItem>
      ))}
    </div>
  );
};

type Props = {
  logo: string;
  isStoreLogo: boolean;
};

export const LeftMenu: React.FC<Props> = ({ logo, isStoreLogo }) => {
  const router = useRouter();
  const storeBranches = useAppState("storeBranches");
  const initialMenu = storeBranches.find((item) => item._id === getStoreId());
  const [activeMenu, setActiveMenu] = React.useState(null);

  useEffect(() => {
    setActiveMenu(initialMenu);
  }, [initialMenu]);

  function handleBranchChange(item) {
    setActiveMenu(item);
    setStoreId(item._id);
  }

  return (
    <LeftMenuBox>
      <Logo
        imageUrl={logo}
        alt={isStoreLogo ? "Shop Logo" : "Orderznow Logo"}
        onClick={() => handleBranchChange(storeBranches[0])}
      />
      {activeMenu ? (
        <MainMenu>
          <Popover
            className="right"
            handler={
              <SelectedItem>
                <span>
                  <span>
                    <FormattedMessage
                      id={activeMenu?._id}
                      defaultMessage={activeMenu?.name?.en}
                    />
                  </span>
                </span>
                <Arrow>
                  <MenuDown />
                </Arrow>
              </SelectedItem>
            }
            content={
              <CategoryMenu
                onClick={handleBranchChange}
                branches={storeBranches}
              />
            }
          />
        </MainMenu>
      ) : null}
    </LeftMenuBox>
  );
};
