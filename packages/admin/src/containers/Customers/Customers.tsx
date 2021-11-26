import React, { useState } from 'react';
import { styled, withStyle, createThemedUseStyletron } from 'baseui';
import { Grid, Row as Rows, Col as Column } from 'components/FlexBox/FlexBox';
import Input from 'components/Input/Input';
import Select from 'components/Select/Select';
import { useQuery } from '@apollo/client';
import { Wrapper, Header, Heading } from 'components/Wrapper.style';

import {
  TableWrapper,
  StyledTable,
  StyledHeadCell,
  StyledBodyCell,
  StyledBodyCellCenter
} from './Customers.style';
import NoResult from 'components/NoResult/NoResult';
import { Q_GET_USERS } from 'services/GQL';
import Pagination from "components/Pagination/Pagination";
import { useForm } from "react-hook-form";
import { Form } from "../DrawerItems/DrawerItems.style";
import { FormFields, FormLabel } from "components/FormFields/FormFields";
import Button from "components/Button/Button";
import { InLineLoader } from "../../components/InlineLoader/InlineLoader";

type CustomThemeT = { red400: string; textNormal: string; colors: any };
const themedUseStyletron = createThemedUseStyletron<CustomThemeT>();

const Col = withStyle(Column, () => ({
  '@media only screen and (max-width: 767px)': {
    marginBottom: '20px',

    ':last-child': {
      marginBottom: 0,
    },
  },
}));

const Row = withStyle(Rows, () => ({
  '@media only screen and (min-width: 768px)': {
    alignItems: 'center',
  },
}));

const Status = styled('div', ({ $theme }) => ({
  ...$theme.typography.fontBold14,
  color: $theme.colors.textDark,
  display: 'flex',
  alignItems: 'center',
  lineHeight: '1',
  textTransform: 'capitalize',

  ':before': {
    content: '""',
    width: '10px',
    height: '10px',
    display: 'inline-block',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    borderBottomRightRadius: '10px',
    borderBottomLeftRadius: '10px',
    backgroundColor: $theme.borders.borderE6,
    marginRight: '10px',
  },
}));

const Badge = styled("div", ({ $theme }) => ({
  ...$theme.typography.fontBold14,
  color: $theme.colors.textDark,
  display: "inline-block",
  lineHeight: "1",
  padding: "4px",
  borderRadius: "4px",
}));

export default function Customers() {
  const [useCss, theme] = themedUseStyletron();

  const sent = useCss({
    ':before': {
      content: '""',
      backgroundColor: theme.colors.primary,
    },
  });

  const failed = useCss({
    ':before': {
      content: '""',
      backgroundColor: theme.colors.red400,
    },
  });

  const paid = useCss({
    ':before': {
      content: '""',
      backgroundColor: theme.colors.blue400,
    },
  });

  const successBg = useCss({
    backgroundColor: theme.colors.primary,
  });

  const warningBg = useCss({
    backgroundColor: theme.colors.red400,
  });

  const countryCodes = [
    { value: "IND", label: "India" },
    { value: "KWT", label: "Kuwait" },
    { value: "KSA", label: "Saudi Arabia" },
    { value: "OMN", label: "Oman" },
    { value: "UAE", label: "UAE" },
    { value: "QAT", label: "Qatar" }
  ];

  const statusTypes = [
    { value: "ON", label: "ON" },
    { value: "OFF", label: "OFF" },
    { value: "BUSY", label: "BUSY" }
  ];

  const { register, handleSubmit, setValue } = useForm();
  const [countryCode, setCountryCode] = useState([]);
  const [status, setStatus] = useState([]);

  const [userFindInputDto, setUserFindInputDto] = useState({
    paginate: {
      page: 1,
      perPage: 10
    }
  });

  const { data, loading, error } = useQuery(Q_GET_USERS, {
    variables: { userFindInputDto }
  });

  const fetchNextPage = (page) => {
    setUserFindInputDto({
      ...userFindInputDto,
      paginate: { page, perPage: 10 }
    });
  };

  const onSubmit = (values) => {
    let formValues;
    Object.keys(values).forEach((value) => {
      if (values[value]) formValues = { ...formValues, [value]: values[value] };
    });

    if (countryCode.length)
      formValues = { ...formValues, countryCode: countryCode[0].value };
    
    if (status.length)
      formValues = { ...formValues, status: status[0].value };

    setUserFindInputDto({
      paginate: { page: 1, perPage: 10 },
      ...formValues
    });
  };

  const clearFilters = () => {
    setValue("mobile", "");
    setValue("email", "");
    setCountryCode([]);
    setStatus([]);

    setUserFindInputDto({
      paginate: { page: 1, perPage: 10 }
    });
  };

  if(error)
    return <div>Error! {error.message}</div>;
  
  let hasNextPage = false,
  hasPrevPage = false,
  page;

  if (data) {
    const { reeshaGetUsers: { pagination } } = data;
    hasNextPage = pagination.hasNextPage;
    hasPrevPage = pagination.hasPrevPage;
    page = pagination.page;
  }

  return (
    <Grid fluid={true}>
      <Row>
        <Col md={12}>
          <Header
            style={{
              marginBottom: 30,
              boxShadow: '0 0 5px rgba(0, 0 ,0, 0.05)',
            }}
          >
            <Col md={3}>
              <Heading>Customers</Heading>
            </Col>
          </Header>

          <Row>
            <Col md={12}>
              <Form
                onSubmit={handleSubmit(onSubmit)}
                style={{ paddingBottom: 0, backgroundColor: "transparent" }}
              >
                <Row>
                  <Col md={3}>
                    <FormFields>
                      <FormLabel>Email</FormLabel>
                      <Input
                        name="email"
                        placeholder="Email"
                        inputRef={register}
                      />
                    </FormFields>
                  </Col>

                  <Col md={3}>
                    <FormFields>
                      <FormLabel>Mobile</FormLabel>
                      <Input
                        name="mobile"
                        placeholder="Mobile"
                        inputRef={register}
                      />
                    </FormFields>
                  </Col>

                  <Col md={3}>
                    <FormFields>
                      <FormLabel>Country Code</FormLabel>
                      <Select
                        options={countryCodes}
                        labelKey="label"
                        valueKey="value"
                        placeholder="Country Code"
                        value={countryCode}
                        searchable={false}
                        onChange={({ value }) => setCountryCode(value)}
                      />
                    </FormFields>
                  </Col>

                  <Col md={3}>
                    <FormFields>
                      <FormLabel>Status</FormLabel>
                      <Select
                        options={statusTypes}
                        labelKey="label"
                        valueKey="value"
                        placeholder="Status"
                        value={status}
                        searchable={false}
                        onChange={({ value }) => setStatus(value)}
                      />
                    </FormFields>
                  </Col>
                </Row>

                <Row>
                  <Col md={2}>
                    <Button
                      type="submit"
                      overrides={{
                        BaseButton: {
                          style: ({ $theme, $size, $shape }) => {
                            return {
                              width: "100%",
                              borderTopLeftRadius: "3px",
                              borderTopRightRadius: "3px",
                              borderBottomLeftRadius: "3px",
                              borderBottomRightRadius: "3px",
                              paddingTop: "8px",
                              paddingBottom: "8px",
                            };
                          },
                        },
                      }}
                    >
                      Search
                    </Button>
                  </Col>

                  <Col md={2}>
                    <Button
                      type="button"
                      onClick={clearFilters}
                      overrides={{
                        BaseButton: {
                          style: ({ $theme, $size, $shape }) => {
                            return {
                              width: "100%",
                              borderTopLeftRadius: "3px",
                              borderTopRightRadius: "3px",
                              borderBottomLeftRadius: "3px",
                              borderBottomRightRadius: "3px",
                              paddingTop: "8px",
                              paddingBottom: "8px",
                            };
                          },
                        },
                      }}
                    >
                      Clear
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>

          {loading ? <InLineLoader /> : (
          <Wrapper style={{ boxShadow: '0 0 5px rgba(0, 0 , 0, 0.05)' }}>
            <TableWrapper>
              <StyledTable
                style={{ borderBottom: "0px" }}
                $gridTemplateColumns="minmax(70px, max-content) minmax(150px, auto) minmax(150px, auto) minmax(100px, max-content) minmax(130px, max-content) minmax(90px, max-content) minmax(100px, max-content)"
              >
                <StyledHeadCell>ID</StyledHeadCell>
                <StyledHeadCell>Name</StyledHeadCell>
                <StyledHeadCell>Email</StyledHeadCell>
                <StyledHeadCell>Mobile</StyledHeadCell>
                <StyledHeadCell>Country Code</StyledHeadCell>
                <StyledHeadCell>Status</StyledHeadCell>
                <StyledHeadCell>Is Activated</StyledHeadCell>

                {data ? (
                  data.reeshaGetUsers &&
                  data.reeshaGetUsers.users.length ? (
                    data.reeshaGetUsers.users
                      .map((item, index) => (
                        <React.Fragment key={index}>
                          <StyledBodyCell>{item._id}</StyledBodyCell>
                          <StyledBodyCell>
                            {item.name}
                          </StyledBodyCell>
                          <StyledBodyCell>{item.email}</StyledBodyCell>
                          <StyledBodyCell>{item.mobile}</StyledBodyCell>
                          <StyledBodyCellCenter>{item.countryCode}</StyledBodyCellCenter>
                          <StyledBodyCellCenter>
                            <Status
                              className={
                                item.status === 'ON'
                                  ? sent
                                  : item.status === 'OFF'
                                  ? failed
                                  : item.status === 'BUSY'
                                  && paid
                              }
                            >
                              {item.status}
                            </Status>
                          </StyledBodyCellCenter>
                          <StyledBodyCellCenter>
                            <Badge
                              className={item.isActivated ? successBg : warningBg}
                            >
                              {item.isActivated ? "True" : "False"}
                            </Badge>
                          </StyledBodyCellCenter>
                        </React.Fragment>
                      ))
                  ) : (
                    <NoResult
                      hideButton={false}
                      style={{
                        gridColumnStart: '1',
                        gridColumnEnd: 'one',
                      }}
                    />
                  )
                ) : null}
              </StyledTable>
            </TableWrapper>

            {data &&
              data.reeshaGetUsers &&
              data.reeshaGetUsers.pagination && (
                <Row>
                  <Col
                    md={12}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Pagination
                      fetchMore={fetchNextPage}
                      hasPrevPage={hasPrevPage}
                      hasNextPage={hasNextPage}
                      currentPage={page}
                    />
                  </Col>
                </Row>
            )}
          </Wrapper>
          )}
        </Col>
      </Row>
    </Grid>
  );
}
