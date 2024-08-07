// Contains detailed structure of XCM call construction for Acala Parachain

import {
  type Extrinsic,
  type IXTokensTransfer,
  type TSerializedApiCall,
  Version,
  type XTokensTransferInput
} from '../../types'
import { getAllNodeProviders } from '../../utils'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

class Acala extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('Acala', 'acala', 'polkadot', Version.V3)
  }

  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    const { currency, currencyID } = input
    let currencyInput = currency;
    if(currency?.toUpperCase() == "ASEED" || currency?.toUpperCase() == "KUSD"){ // Token has symbol ASEED but asset id is Token: AUSD
      currencyInput = "AUSD"
    }
    
    let currencySelection;
    if(currencyInput?.toUpperCase() == "LCDOT"){
      currencySelection = { LiquidCrowdloan: "13" }
    } else if(currencyID !== undefined){
      currencySelection = { ForeignAsset: currencyID }
    } else {
      currencySelection = { Token: currencyInput }
    }
    // const currencySelection =
    //   currencyID !== undefined ? { ForeignAsset: currencyID } : { Token: currencyInput }
    return XTokensTransferImpl.transferXTokens(input, currencySelection)
  }

  getProvider(): string {
    // Return the second WebSocket URL because the first one is sometimes unreliable.
    return getAllNodeProviders(this.node)[1]
  }
}

export default Acala
