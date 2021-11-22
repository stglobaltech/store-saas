import { gql } from "@apollo/client";

export const Q_GET_TODAYS_AND_MONTHS_ORDER_COUNT_AND_EARNINGS = gql`
  query($storeId: String!) {
    getTodaysAndMonthsOrderCountAndEarnings(storeId: $storeId) {
      todaysStats {
        orderStatus
        totalEarnings
        orderCount
      }
      monthsStats {
        orderStatus
        totalEarnings
        orderCount
      }
    }
  }
`;

export const Q_GRAPH_REPORT_ORDER_STATS = gql`
  query($storeId: String!) {
    graphReportOrderStats(storeId: $storeId) {
      date
      day
      totalEarnings
      totalOrders
    }
  }
`;
