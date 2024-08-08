// Contains detailed structure of XCM call construction for Darwinia Parachain

import {
  type IPolkadotXCMTransfer,
  type PolkadotXCMTransferInput,
  Version,
  type Extrinsic,
  type TSerializedApiCall
} from '../../types'
import { ScenarioNotSupportedError } from '../../errors/ScenarioNotSupportedError'
import ParachainNode from '../ParachainNode'
import PolkadotXCMTransferImpl from '../PolkadotXCMTransferImpl'
import { NodeNotSupportedError } from '../../errors'

class Darwinia extends ParachainNode implements IPolkadotXCMTransfer {
  constructor() {
    super('Darwinia', 'darwinia', 'polkadot', Version.V3)
  }

  // TODO Configure xcm for other assets
  // For transfer of other assets, can use xtokens.transferMultiAssets
  transferPolkadotXCM(input: PolkadotXCMTransferInput): Extrinsic | TSerializedApiCall {
    // TESTED https://polkadot.subscan.io/xcm_message/polkadot-55c5c36c8fe8794c8cfbea725c9f8bc5984c6b05
    if (input.scenario === 'ParaToPara') {
      if(input.currencySelection !== 'RING') throw new Error(`Darwinia not configured for xcm of ${input.currencySelection}`)
      return PolkadotXCMTransferImpl.transferPolkadotXCM(input, 'reserveTransferAssets')
    }
    throw new ScenarioNotSupportedError(this.node, input.scenario)
  }

  transferRelayToPara(): TSerializedApiCall {
    throw new NodeNotSupportedError()
  }
}

export default Darwinia
