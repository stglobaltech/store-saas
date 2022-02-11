import React from "react";
import {
  ProgressBarWrapper,
  ProgressStep,
  ProgressBar,
  StatusTitle,
  StatusBox,
  StatusDetails,
  CheckMarkWrapper,
  SingleProgressStep,
} from "./progress-box.style";
import { CheckMark } from "assets/icons/CheckMark";

type ProgressProps = {
  data?: any;
  status?: any;
};

const ProgressBox: React.FC<ProgressProps> = ({ status, data }) => {
  const findStatusIndex = () => {
    let idx;
    data.forEach((value, index) => {
      if (typeof status === "string") {
        if (value.label === status) {
          idx = index;
        }
      } else {
        if (value.label === status?.label) {
          idx = index;
        }
      }
    });
    return idx;
  };

  return (
    <>
      {data.length !== 1 ? (
        <>
          {data?.map((item, index) => (
            <ProgressStep key={index}>
              <ProgressBarWrapper
                className={findStatusIndex() >= index ? "checked" : ""}
              >
                <StatusBox>
                  {status >= index + 1 ? (
                    <CheckMarkWrapper>
                      <CheckMark />
                    </CheckMarkWrapper>
                  ) : (
                    index + 1
                  )}
                </StatusBox>
                <ProgressBar />
              </ProgressBarWrapper>
              <StatusDetails>
                {item ? <StatusTitle>{item.label}</StatusTitle> : ""}
              </StatusDetails>
            </ProgressStep>
          ))}
        </>
      ) : (
        <>
          {data?.map((item, index) => (
            <SingleProgressStep key={index}>
              <ProgressBarWrapper
                className={findStatusIndex() >= index ? "checked" : ""}
              >
                <StatusBox>
                  {status >= index + 1 ? (
                    <CheckMarkWrapper>
                      <CheckMark />
                    </CheckMarkWrapper>
                  ) : (
                    index + 1
                  )}
                </StatusBox>
                <ProgressBar />
              </ProgressBarWrapper>
              <StatusDetails>
                {item ? <StatusTitle>{item.label}</StatusTitle> : ""}
              </StatusDetails>
            </SingleProgressStep>
          ))}
        </>
      )}
    </>
  );
};

export default ProgressBox;
