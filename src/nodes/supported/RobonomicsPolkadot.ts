// Contains detailed structure of XCM call construction for Robonomics Parachain

import {
    type IPolkadotXCMTransfer,
    type PolkadotXCMTransferInput,
    Version,
    type Extrinsic,
    type TSerializedApiCall
  } from '../../types'
  import ParachainNode from '../ParachainNode'
  import PolkadotXCMTransferImpl from '../PolkadotXCMTransferImpl'
  
  // Robonimics XCM not available yet
  class RobonomicsPolkadot extends ParachainNode implements IPolkadotXCMTransfer {
    constructor() {
      super('RobonomicsPolkadot', 'robonomicsPolkadot', 'polkadot', Version.V3)
    }
  
    private static readonly FEE = '400000000'
  
    transferPolkadotXCM(input: PolkadotXCMTransferInput): Extrinsic | TSerializedApiCall {
      // if (input.scenario === 'ParaToPara') {
      //   return PolkadotXCMTransferImpl.transferPolkadotXCM(input, 'limitedReserveTransferAssets', {
      //     Limited: Robonomics.FEE
      //   })
      // }
      if (input.scenario === 'ParaToPara') {
        return PolkadotXCMTransferImpl.transferPolkadotXCM(input, 'limitedReserveTransferAssets', 'Unlimited')
      }
      return PolkadotXCMTransferImpl.transferPolkadotXCM(input, 'reserveWithdrawAssets')
    }
  }
  
  export default RobonomicsPolkadot
  