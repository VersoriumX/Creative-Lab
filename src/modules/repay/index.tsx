import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { useProtocolDataContext } from '../../libs/protocol-data-provider';
import ScreenWrapper from '../../components/wrappers/ScreenWrapper';
import RepayScreenWrapper from './components/RepayScreenWrapper';
import routeParamValidationHOC, {
  ValidationWrapperComponentProps,
} from '../../components/RouteParamsValidationWrapper';

import RepayMain from './screens/RepayMain';
import RepayAmount from './screens/RepayAmount';
import RepayConfirmation from './screens/RepayConfirmation';
import RepayAmountWithSelect from './screens/RepayAmountWithSelect';
import RepayWithCollateralConfirmation from './screens/RepayWithCollateralConfirmation';
import { isFeatureEnabled } from '../../helpers/config/markets-and-network-config';
import { getAssetInfo } from '../../helpers/config/assets-config';

import messages from './messages';

function Repay({
  user,
  walletBalance,
  walletBalanceUSD,
  currencySymbol,
  userReserve,
}: ValidationWrapperComponentProps) {
  const intl = useIntl();
  const { currentMarketData } = useProtocolDataContext();
  const asset = getAssetInfo(currencySymbol);

  return (
    <ScreenWrapper
      pageTitle={intl.formatMessage(messages.pageTitle, {
        currencySymbol: asset.formattedName,
      })}
    >
      <RepayScreenWrapper
        title={intl.formatMessage(messages.pageTitle, {
          currencySymbol: asset.formattedName,
        })}
        currentBorrows={userReserve?.totalBorrows || '0'}
        currentBorrowsInUSD={userReserve?.totalBorrowsUSD || '0'}
        walletBalance={walletBalance.toString()}
        walletBalanceInUSD={walletBalanceUSD.toString()}
        totalCollateralUSD={user?.totalCollateralUSD || '0'}
        totalCollateralMarketReferenceCurrency={user?.totalCollateralMarketReferenceCurrency || '0'}
        currencySymbol={currencySymbol}
        healthFactor={user?.healthFactor || '0'}
        loanToValue={user?.currentLoanToValue || '0'}
      >
        <Routes>
          <Route path="/" element={<RepayMain />} />

          <Route path="balance" element={<RepayAmount />} />
          <Route path={`balance/confirmation`} element={<RepayConfirmation />} />

          {isFeatureEnabled.collateralRepay(currentMarketData) && (
            <React.Fragment key="RepayCollateral">
              <Route
                path={`collateral`}
                key="RepayCollateralAmount"
                element={<RepayAmountWithSelect />}
              />
              <Route
                path={`collateral/confirmation`}
                key="RepayCollateralConfirmation"
                element={<RepayWithCollateralConfirmation />}
              />
            </React.Fragment>
          )}
        </Routes>
      </RepayScreenWrapper>
    </ScreenWrapper>
  );
}

export default routeParamValidationHOC({
  withWalletBalance: true,
  withUserReserve: true,
})(Repay);
