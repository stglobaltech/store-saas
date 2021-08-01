import React from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import Sticky from 'react-stickynode';
import { useAppState } from 'contexts/app/app.provider';
import {
  SidebarMobileLoader,
  SidebarLoader,
} from 'components/placeholder/placeholder';
import {
  CategoryWrapper,
  TreeWrapper,
  PopoverWrapper,
  SidebarWrapper,
} from './sidebar.style';

import { TreeMenu } from 'components/tree-menu/tree-menu';

import { GET_CATEGORIES } from 'utils/graphql/query/category.query';
import { useMedia } from 'utils/use-media';
import CategoryWalker from 'components/category-walker/category-walker';
import { Scrollbar } from 'components/scrollbar/scrollbar';

type SidebarProps = {
  type: string;
};

const Sidebar: React.FC<SidebarProps> = ({ type }) => {
  const tablet = useMedia('(max-width: 991px)');
  const router = useRouter();
  const { data, loading } = useQuery(GET_CATEGORIES, {
    variables: { type },
  });
  const { pathname, query } = router;
  const selectedQueries = query.category;

  const onCategoryClick = (slug: string) => {
    const { type, ...rest } = query;
    if (type) {
      router.push(
        {
          pathname,
          query: { ...rest, category: slug },
        },
        {
          pathname: `/${type}`,
          query: { ...rest, category: slug },
        }
      );
    } else {
      router.push({
        pathname,
        query: { ...rest, category: slug },
      });
    }
  };
  const isSidebarSticky = useAppState('isSidebarSticky');

  if (!data || loading) {
    if (tablet) {
      return <SidebarMobileLoader />;
    }
    return <SidebarLoader />;
  }
  return (
    <CategoryWrapper>
      <PopoverWrapper>
        <CategoryWalker>
          <TreeMenu
            data={data.categories}
            onClick={onCategoryClick}
            active={selectedQueries}
          />
        </CategoryWalker>
      </PopoverWrapper>

      <SidebarWrapper style={{ paddingTop: 45 }}>
        <Sticky enabled={isSidebarSticky} top={110}>
          <Scrollbar className="sidebar-scrollbar">
            <TreeWrapper>
              <TreeMenu
                data={data.categories}
                onClick={onCategoryClick}
                active={selectedQueries}
              />
            </TreeWrapper>
          </Scrollbar>
        </Sticky>
      </SidebarWrapper>
    </CategoryWrapper>
  );
};

export default Sidebar;
