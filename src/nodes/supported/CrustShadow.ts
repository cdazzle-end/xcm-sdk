// Contains detailed structure of XCM call construction for CrustShadow Parachain

import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

class CrustShadow extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('CrustShadow', 'shadow', 'kusama', Version.V3)
  }

  // TODO Add Crust Shadow assets to registry
  getCurrencySelection({ currencyID }: XTokensTransferInput): any {
    if (currencyID === 'CSM') {
      return 'SelfReserve'
    }

    if (currencyID === undefined) {
      throw new Error(`Crust Shadow xcm input currencyID is not specified.`)
    }

    return { OtherReserve: currencyID }
  }

  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    return XTokensTransferImpl.transferXTokens(input, this.getCurrencySelection(input))
  }
}

export default CrustShadow
