// Contains detailed structure of XCM call construction for Mangata Parachain

import { type ApiPromise } from '@polkadot/api'
import {
  type IXTokensTransfer,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

class Mangata extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('Mangata', 'mangata', 'kusama', Version.V3)
  }

  // XTokens input === local id
  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    return XTokensTransferImpl.transferXTokens(input, input.currencyID)
  }

  async createApiInstance(localProvider?: string): Promise<ApiPromise> {
    const MangataSDK = await import('@mangata-finance/sdk')
    const instance = localProvider !== undefined ? MangataSDK.Mangata.instance([localProvider]) : MangataSDK.Mangata.instance([this.getProvider()])
    return await instance.api()
  }
}

export default Mangata
