// Contains detailed structure of XCM call construction for Amplitude Parachain

import { InvalidCurrencyError } from '../../errors'
import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

// TODO Add amplitude assets to registry
class Amplitude extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('Amplitude', 'amplitude', 'kusama', Version.V3)
  }

  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {

    if (input.currencyID !== 'Native') {
      throw new InvalidCurrencyError(
        `Asset ${input.currencyID} is not supported by node ${this.node}.`
      )
    }
    const currencySelection = input.currencyID === 'Native' ? "Native" : { XCM: input.currencyID }
    return XTokensTransferImpl.transferXTokens(input, currencySelection)
  }
}

export default Amplitude
