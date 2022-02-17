import { useIntl } from 'react-intl';
const intl = useIntl();

const paymentoptions = [
  {
    id: "1",
    title: "cash",
    content: intl.formatMessage({
      id: 'paymentTypeCashDesc',
      defaultMessage: 'Pay by cash once you receive your order'
    })
  },
  {
    id: "2",
    title: "card",
    content: intl.formatMessage({
      id: 'paymentTypeCardDesc',
      defaultMessage: 'Pay now using your card'
    })
  },
  {
    id: "3",
    title: "wallet",
    content: intl.formatMessage({
      id: 'paymentTypeWalletDesc',
      defaultMessage: 'Use your wallet amount to pay'
    })
  },
];

export const refactorPaymentMethods = (workFlowPolicyData) => {
  let policies = {};
  if (
    workFlowPolicyData &&
    workFlowPolicyData.paymentType &&
    workFlowPolicyData.paymentType.length
  ) {
    if (
      workFlowPolicyData?.gateWayName?.length
    ) {
      const plan =
        workFlowPolicyData.gateWayName[0];
      policies["gateWayName"] = plan;
      policies["paymentType"] = workFlowPolicyData.paymentType.map((type, index) => {
        return {
          type,
          id: index,
          description: paymentoptions.filter(
            (option) => option.title === type
          )[0].content,
        };
      });
    } else {
      policies["paymentType"] = [
        {
          type: "cash",
          id: 1,
          description: paymentoptions.filter(
            (option) => option.title === "cash"
          )[0].content,
        },
      ];
    }
  }
  return policies;
};
