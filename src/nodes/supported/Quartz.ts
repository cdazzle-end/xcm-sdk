// Contains detailed structure of XCM call construction for Quartz Parachain

import {
  Version,
  type Extrinsic,
  type TSerializedApiCall,
  type IPolkadotXCMTransfer,
  type PolkadotXCMTransferInput
} from '../../types'
import ParachainNode from '../ParachainNode'
import PolkadotXCMTransferImpl from '../PolkadotXCMTransferImpl'

class Quartz extends ParachainNode implements IPolkadotXCMTransfer {
  constructor() {
    super('Quartz', 'quartz', 'kusama', Version.V3)
  }

  _assetCheckEnabled = false

  transferPolkadotXCM(input: PolkadotXCMTransferInput): Extrinsic | TSerializedApiCall {
    if(input.currencySelection !== 'QTZ') throw new Error(`Quartz XCM not configured to support ${input.currencySelection}`)
    return PolkadotXCMTransferImpl.transferPolkadotXCM(input, 'limitedReserveTransferAssets', 'Unlimited')
  }
}

export default Quartz
