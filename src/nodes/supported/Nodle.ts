// Contains detailed structure of XCM call construction for Nodle Parachain

import {
  InvalidCurrencyError,
  NodeNotSupportedError,
  ScenarioNotSupportedError
} from '../../errors'
import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

class Nodle extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('Nodle', 'nodle', 'polkadot', Version.V3)
  }

  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    if (input.scenario !== 'ParaToPara') {
      throw new ScenarioNotSupportedError(this.node, input.scenario)
    }

    if (input.currencyID !== 'NODL') {
      throw new InvalidCurrencyError(
        `Asset ${input.currencyID} is not supported by node ${this.node}.`
      )
    }

    return XTokensTransferImpl.transferXTokens(input, 'NodleNative')
  }

  transferRelayToPara(): TSerializedApiCall {
    throw new NodeNotSupportedError()
  }
}

export default Nodle
