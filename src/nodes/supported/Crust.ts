// Contains detailed structure of XCM call construction for Crust Parachain

import { InvalidCurrencyError } from '../../errors/InvalidCurrencyError'
import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'


// If asset is CRU, than input is SelfReserve
class Crust extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('Crust', 'crustParachain', 'polkadot', Version.V3)
  }

  getCurrencySelection({ currency, currencyID }: XTokensTransferInput): any {
    if (currencyID === 'CRU') {
      return 'SelfReserve'
    }

    if (currencyID === undefined) {
      throw new InvalidCurrencyError(`Asset ${currency} is not supported by node ${this.node}.`)
    }

    return { OtherReserve: currencyID }
  }

  // XTokens !== localId. CRU: SelfReserve | other assets: {OtherReserve: currencyID}
  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    return XTokensTransferImpl.transferXTokens(input, this.getCurrencySelection(input), "Unlimited")
  }
}

export default Crust
