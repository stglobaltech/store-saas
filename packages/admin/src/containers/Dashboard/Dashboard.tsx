import React from 'react';
import { withStyle, useStyletron } from 'baseui';
import { Grid, Row, Col as Column } from 'components/FlexBox/FlexBox';
import LineChart from 'components/Widgets/LineChart/LineChart'
import StickerCard from 'components/Widgets/StickerCard/StickerCard';
import { CoinIcon } from 'assets/icons/CoinIcon';
import { CartIconBig } from 'assets/icons/CartIconBig';
import { useQuery } from "@apollo/client";
import {
  Q_GET_STORE_ID,
  Q_GET_TODAYS_AND_MONTHS_ORDER_COUNT_AND_EARNINGS,
  Q_GRAPH_REPORT_ORDER_STATS
} from "services/GQL";
import { InLineLoader } from 'components/InlineLoader/InlineLoader';

const Col = withStyle(Column, () => ({
  '@media only screen and (max-width: 574px)': {
    marginBottom: '30px',

    ':last-child': {
      marginBottom: 0,
    },
  },
}));

const Dashboard = () => {
  const [css] = useStyletron();
  const mb30 = css({
    '@media only screen and (max-width: 990px)': {
      marginBottom: '16px',
    },
  });

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  
  const date = new Date();

  const { data: { storeId } } = useQuery(Q_GET_STORE_ID);

  const { loading: statsLoader, error: statsError, data: stats } = useQuery(Q_GET_TODAYS_AND_MONTHS_ORDER_COUNT_AND_EARNINGS, {
    variables: { storeId }
  });

  const { loading: graphLoader, error: graphError, data: graph } = useQuery(Q_GRAPH_REPORT_ORDER_STATS, {
    variables: { storeId }
  });

  const daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  }

  const getLabels = (() => {
    let today = new Date();
    let month = today.getMonth();
    let labels = daysInMonth(month + 1, today.getFullYear());
    let days = [];
    for (let i = 1; i <= labels; i++) {
      days.push(i);
    }
    return days;
  })();

  const dataSets = (() => {
    if(graph) {
    let todaysDate = new Date();
    const [month, year] = [todaysDate.getMonth(), todaysDate.getFullYear()];
    const numberOfDays = new Date(year, month, 0).getDate();
    const data1 = new Array(numberOfDays).fill(0);
    const data2 = new Array(numberOfDays).fill(0);
    for (let i = 0; i < graph.graphReportOrderStats.length; i++) {
      let date = new Date(graph.graphReportOrderStats[i].date).getDate();
      data1[date - 1] = graph.graphReportOrderStats[i].totalEarnings;
      data2[date - 1] = graph.graphReportOrderStats[i].totalOrders;
    }

    return [
      {
        name: "Total Order Earnings",
        data: data1
      },
      {
        name: "Total Order Count",
        data: data2
      }
    ]
  }
  })();

  let todaysOrders = "0",
  todaysEarning = "0",
  monthlyOrders = "0",
  monthlyEarning = "0";

  if(stats) {
    const statsData = stats.getTodaysAndMonthsOrderCountAndEarnings;
    if(statsData.todaysStats.length) {
      todaysOrders = statsData.todaysStats[0].orderCount ? statsData.todaysStats[0].orderCount.toString() : "0";
      todaysEarning = statsData.todaysStats[0].totalEarnings ? statsData.todaysStats[0].totalEarnings.toString() : "0";
    }

    if(statsData.monthsStats.length) {
      monthlyOrders = statsData.monthsStats[0].orderCount ? statsData.monthsStats[0].orderCount.toString() : "0";
      monthlyEarning = statsData.monthsStats[0].totalEarnings ? statsData.monthsStats[0].totalEarnings.toString() : "0";
    }
  }

  if(statsLoader || graphLoader)
    return <InLineLoader />;
  
  if(statsError || graphError)
    return <div>Error Fetching Data</div>;

  return (
    <Grid fluid={true}>
      <Row>
        <Col lg={3} sm={6} xs={12} className={mb30}>
          <StickerCard
            title="Today's Orders"
            subtitle="(Last 24 Hours)"
            icon={<CartIconBig />}
            price={todaysOrders}
            // indicator="down"
            // indicatorText="Order down"
            // note="(previous 30 days)"
            // link="#"
            // linkText="Full Details"
          />
        </Col>
        <Col lg={3} sm={6} xs={12} className={mb30}>
          <StickerCard
            title="Monthly Orders"
            subtitle="(Last 30 Days)"
            icon={<CartIconBig />}
            price={monthlyOrders}
            // indicator="down"
            // indicatorText="Order down"
            // note="(previous 30 days)"
            // link="#"
            // linkText="Full Details"
          />
        </Col>
        <Col lg={3} sm={6} xs={12} className={mb30}>
          <StickerCard
            title="Today's Earning"
            subtitle="(Last 24 Hours)"
            icon={<CoinIcon />}
            price={`$${todaysEarning}`}
            // indicator="up"
            // indicatorText="Revenue up"
            // note="(previous 30 days)"
            // link="#"
            // linkText="Full Details"
          />
        </Col>
        <Col lg={3} sm={6} xs={12} className={mb30}>
          <StickerCard
            title="Monthly Earning"
            subtitle="(Last 30 Days)"
            icon={<CoinIcon />}
            price={`$${monthlyEarning}`}
            // indicator="up"
            // indicatorText="Revenue up"
            // note="(previous 30 days)"
            // link="#"
            // linkText="Full Details"
          />
        </Col>
      </Row>

      {graph && (
      <Row>
        <Col md={12} lg={12}>
          <LineChart
            widgetTitle={`Sales - ${monthNames[date.getMonth()]}`}
            color={['#03D3B5', '#666d92']}
            categories={getLabels}
            series={dataSets}
          />
        </Col>
      </Row>
      )}

      {/* <Row>
        <Col md={7} lg={8}>
          <GraphChart
            widgetTitle="Sales From Social Media"
            colors={['#03D3B5']}
            series={[25, 30, 14, 30, 55, 60, 48]}
            labels={[
              '2019-05-12',
              '2019-05-13',
              '2019-05-14',
              '2019-05-15',
              '2019-05-16',
              '2019-05-17',
              '2019-05-18',
            ]}
          />
        </Col>

        <Col md={5} lg={4}>
          <DonutChart
            widgetTitle="Target"
            series={[30634, 6340]}
            labels={['Todays Revenue', 'Todays Refund']}
            colors={['#03D3B5', '#666d92']}
            helperText={['Weekly Targets', 'Monthly Targets']}
            icon={[<Revenue />, <Refund />]}
            prefix="$"
          />
        </Col>
      </Row>
 */}
      {/* <Row>
        <Col md={5} lg={4} sm={6}>
          <RadialBarChart
            widgetTitle="Target"
            series={[43, 75]}
            label={['$1,342', '$8,908']}
            colors={['#03D3B5', '#666d92']}
            helperText={['Weekly Targets', 'Monthly Targets']}
          />
        </Col>
        <Col md={7} lg={8} sm={6}>
          <ColumnChart
            widgetTitle="Sale History"
            colors={['#03D3B5']}
            prefix="$"
            totalValue="1,92,564"
            position="up"
            percentage="1.38%"
            text="More than last year"
            series={[44, 55, 41, 67, 22, 43, 21, 33, 45, 31, 87, 65]}
            categories={[
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col md={5} lg={4}>
          <GradiantGraphChart
            colors={['#03D3B5']}
            series={[25, 30, 14, 30, 55, 60, 48]}
            labels={[
              '2019-05-12',
              '2019-05-13',
              '2019-05-14',
              '2019-05-15',
              '2019-05-16',
              '2019-05-17',
              '2019-05-18',
            ]}
            topRowTitle="Performance"
            bottomRowData={[
              {
                label: 'Last Week Profit',
                valueText: '+29.7%',
                value: 29.7,
                color: '#03D3B5',
              },
              {
                label: 'This Week Losses',
                valueText: '-53.4%',
                value: 53.4,
                color: '#FC747A',
              },
            ]}
          />
        </Col>

        <Col md={7} lg={8}>
          <MapWidget
            data={[
              {
                name: 'Williamburgs',
                value: 69922,
                color: '#2170FF',
              },
              {
                name: 'Brooklyn',
                value: 41953,
                color: '#29CAE4',
              },
              {
                name: 'New York',
                value: 23307,
                color: '#666D92',
              },
              {
                name: 'Jersey City',
                value: 20200,
                color: '#03D3B5',
              },
            ]}
            totalText="Total Client"
          />
        </Col>
      </Row> */}
    </Grid>
  );
};

export default Dashboard;
