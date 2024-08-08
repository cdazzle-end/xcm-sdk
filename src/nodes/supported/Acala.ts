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

type AcalaAssetType = 'Erc20' | 'Token' | 'LiquidCrowdloan' | 'StableAssetPoolToken' | 'ForeignAsset';


class Acala extends ParachainNode implements IXTokensTransfer {
  constructor() {
    super('Acala', 'acala', 'polkadot', Version.V3)
  }

  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    const { currencyID } = input
    // let    = currency;
    // if(currency?.toUpperCase() === "ASEED" || currency?.toUpperCase() === "KUSD"){ // Token has symbol ASEED but asset id is Token: AUSD
    //   currencyInput = "AUSD"
    // }
    
    // let currencySelection;
    // if(currencyInput?.toUpperCase() === "LCDOT"){
    //   currencySelection = { LiquidCrowdloan: "13" }
    // } else if(currencyID !== undefined){
    //   currencySelection = { ForeignAsset: currencyID }
    // } else {
    //   currencySelection = { Token: currencyInput }
    // }

    let [acalaAssetType, assetValue] = determineAssetType(currencyID)
    if(acalaAssetType === 'StableAssetPoolToken' || acalaAssetType === 'Erc20'){
      throw new Error(`Acala not configured to xcm transfer stable pool token or erc20. ${JSON.stringify(currencyID)}`)
    }

    if(assetValue.toUpperCase() === "ASEED" || assetValue.toUpperCase() === "KUSD"){ // Token has symbol ASEED but asset id is Token: AUSD
      assetValue = "AUSD"
    }
    const formattedAssetParameter = {
      [acalaAssetType]: assetValue
    }

    return XTokensTransferImpl.transferXTokens(input, formattedAssetParameter)
  }

  getProvider(): string {
    // Return the second WebSocket URL because the first one is sometimes unreliable.
    return getAllNodeProviders(this.node)[1]
  }
}

// Acala asset id's are formatted differently than the actual name of the asset type used in function params
function determineAssetType(localId: any): [AcalaAssetType, string] {
  if ('NativeAssetId' in localId) {
    if (localId.NativeAssetId !== undefined && 'Token' in localId.NativeAssetId) return ['Token', localId.NativeAssetId.Token];
    if (localId.NativeAssetId !== undefined && 'LiquidCrowdloan' in localId.NativeAssetId) return ['LiquidCrowdloan', localId.NativeAssetId.LiquidCrowdloan];
  }
  if ('ForeignAssetId' in localId) return ['ForeignAsset', localId.ForeignAssetId];
  if ('StableAssetId' in localId) return ['StableAssetPoolToken', localId.StableAssetId];
  if ('Erc20' in localId) return ['Erc20', localId.Erc20];

  throw new Error('Unknown asset type');
}

export default Acala
