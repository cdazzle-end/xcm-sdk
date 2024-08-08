// Contains detailed structure of XCM call construction for Moonriver Parachain

import { constructRelayToParaParameters } from '../../pallets/xcmPallet/utils'
import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall,
  type TTransferRelayToParaOptions
} from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

class Moonriver extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('Moonriver', 'moonriver', 'kusama', Version.V3)
  }

  // XTokens input === SelfReserve OR { ForeignAsset: localId}
  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    const { currencyID } = input
    const currencySelection = currencyID === 'MOVR' ? 'SelfReserve' : { ForeignAsset: currencyID }
    return XTokensTransferImpl.transferXTokens(input, currencySelection)
  }

  transferRelayToPara(options: TTransferRelayToParaOptions): TSerializedApiCall {
    return {
      module: 'xcmPallet',
      section: 'limitedReserveTransferAssets',
      parameters: constructRelayToParaParameters(options, Version.V3, true)
    }
  }
}

export default Moonriver
