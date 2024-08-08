// Contains detailed structure of XCM call construction for Integritee Parachain

import { InvalidCurrencyError, NodeNotSupportedError } from '../../errors'
import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

class IntegriteeKusama extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('IntegriteeKusama', 'integriteeKusama', 'kusama', Version.V3)
  }

  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    if (input.currencyID !== 'TEER')
      throw new InvalidCurrencyError(`Node ${this.node} does not support currency ${input.currencyID}`)
    return XTokensTransferImpl.transferXTokens(input, input.currencyID)
  }

  transferRelayToPara(): TSerializedApiCall {
    throw new NodeNotSupportedError()
  }
}

export default IntegriteeKusama
