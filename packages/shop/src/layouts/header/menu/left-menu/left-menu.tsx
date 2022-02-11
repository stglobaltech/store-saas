import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { FormattedMessage } from "react-intl";
import Popover from "components/popover/popover";
import Logo from "layouts/logo/logo";
import { MenuDown } from "assets/icons/MenuDown";
import { CATEGORY_MENU_ITEMS } from "site-settings/site-navigation";
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
import { useAppDispatch, useAppState } from "contexts/app/app.provider";
import { privatePaths } from "utils/routes";

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
  showLogo?:boolean;
};

export const LeftMenu: React.FC<Props> = ({ logo, isStoreLogo,showLogo }) => {
  const router = useRouter();
  const branches = useAppState("branches");
  const activeStoreId = useAppState("activeStoreId");
  const appDispatch = useAppDispatch();
  const initialMenu = branches.find((item) => item._id === activeStoreId);
  const [activeMenu, setActiveMenu] = React.useState(null);

  useEffect(() => {
    setActiveMenu(initialMenu);
  }, [initialMenu]);

  function handleBranchChange(item) {
    setActiveMenu(item);
    appDispatch({ type: "ACTIVE_STORE_ID", payload: item._id });
  }

  const path = router.pathname;

  return (
    <LeftMenuBox>
      {showLogo?<Logo
        imageUrl={logo}
        alt={isStoreLogo ? "Shop Logo" : "Orderznow Logo"}
        onClick={() => router.replace("/")}
      />:null}

      {activeMenu && !privatePaths.includes(path) ? (
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
              <CategoryMenu onClick={handleBranchChange} branches={branches} />
            }
          />
        </MainMenu>
      ) : null}

      {/* <MainMenu>
        <Popover
          className="right"
          handler={
            <SelectedItem>
              <span>
                <Icon>
                  <CategoryIcon name={activeMenu?.icon} />
                </Icon>
                <span>
                  <FormattedMessage
                    id={activeMenu?.id}
                    defaultMessage={activeMenu?.defaultMessage}
                  />
                </span>
              </span>
              <Arrow>
                <MenuDown />
              </Arrow>
            </SelectedItem>
          }
          content={<CategoryMenu onClick={setActiveMenu} />}
        />
      </MainMenu> */}
    </LeftMenuBox>
  );
};
