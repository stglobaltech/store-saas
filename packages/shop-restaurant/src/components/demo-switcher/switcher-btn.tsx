import React, { useState } from 'react';
import FullScreenModal from 'components/modal/fullscreen-modal';
import {
  SwitcherWrapper,
  Switcher,
  Header,
  PurchaseBtn,
  ModalTitle,
  CloseButton,
  Body,
  Content,
  DemoCard,
  DemoImageWrapper,
  DemoImage,
  VisitBtn,
  DemoTitle,
} from './switcher.style';
import { ShoppingBagAlt } from 'assets/icons/shopping-bag-alt';
import { CloseIcon } from 'assets/icons/close-icon';
import { Scrollbar } from 'components/scrollbar/scrollbar';

import { DemoData } from './data';

const DemoSwitcher = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <SwitcherWrapper onClick={() => setOpen(true)}>
        <Switcher>Demos</Switcher>
      </SwitcherWrapper>

      <FullScreenModal
        isOpen={isOpen}
        onRequestClose={() => setOpen(false)}
        defaultClose={false}
      >
        <Header>
          <PurchaseBtn href="https://1.envato.market/E1DxW" target="_blank">
            <ShoppingBagAlt style={{ marginRight: '7px', width: '18px' }} />{' '}
            Purchase
          </PurchaseBtn>

          <ModalTitle>Demos</ModalTitle>

          <CloseButton onClick={() => setOpen(false)}>
            <CloseIcon style={{ width: 14, height: 14 }} />
          </CloseButton>
        </Header>

        <Body>
          <Scrollbar style={{ height: '100%', maxHeight: '100%' }}>
            <Content>
              {DemoData.map((item, index) => (
                <DemoCard key={index}>
                  <DemoImageWrapper>
                    <DemoImage>
                      <img src={item.image} alt={item.title} />
                      <VisitBtn
                        className="demo-btn"
                        href={item.link}
                        target="_blank"
                      >
                        View Demo
                      </VisitBtn>
                    </DemoImage>
                  </DemoImageWrapper>

                  <DemoTitle>{item.title}</DemoTitle>
                </DemoCard>
              ))}
            </Content>
          </Scrollbar>
        </Body>
      </FullScreenModal>
    </>
  );
};

export default DemoSwitcher;
