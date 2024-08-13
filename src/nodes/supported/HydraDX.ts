// Contains detailed structure of XCM call construction for HydraDX Parachain

import { getParaId } from '../../pallets/assets'
import { findValueByKey, getAssetRegistryObject } from '../../pallets/assets/assetsUtils'
import {
  type IXTokensTransfer,
  type IXTokensTransferMultiassets,
  Version,
  type XTokensTransferInput,
  type Extrinsic,
  type TSerializedApiCall,
  type TScenario,
  type TNode,
} from '../../types'
// import { createCurrencySpecification } from '../../utils'
import ParachainNode from '../ParachainNode'
import XTokensTransferImpl from '../XTokensTransferImpl'

const USDT_ID = "10"
const USDT_FEE_AMOUNT = "180000"
// const HYDRA_ID = "2034"
class HydraDX extends ParachainNode implements IXTokensTransfer, IXTokensTransferMultiassets {
  constructor() {
    super('HydraDX', 'hydradx', 'polkadot', Version.V3)
  }

  // XToken input === localId
  transferXTokens(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    const { currencyID } = input
    return XTokensTransferImpl.transferXTokens(input, Number.parseInt(currencyID))
  }

  transferXTokensMultiassets(input: XTokensTransferInput): Extrinsic | TSerializedApiCall {
    const { amount, currencyID, scenario } = input

    const currencyAssetMultilocation = createAssetMultilocationAndAmount(amount, scenario, this.node, currencyID)
    const feeAssetMultilocation = createAssetMultilocationAndAmount(USDT_FEE_AMOUNT, scenario, this.node, USDT_ID)

    // By this point, all params should be created
    return XTokensTransferImpl.transferXTokensMultiassets(input, currencyAssetMultilocation, feeAssetMultilocation)
  }

}

// Creates params asset multilocation, relative to sending node, and fungible amount. Assets from registry will have full multilocation
export const createAssetMultilocationAndAmount = (
  amount: string,
  scenario: TScenario,
  senderNode: TNode,
  currencyId: string,
): any => {
  if(scenario !== "ParaToPara"){
    throw new Error(`createAssetMultilocation not configured for ${scenario}`)
  }

  const senderChain = getParaId(senderNode)

  // Use senderChain to get assetRegistryObject
  const senderAssetObject = getAssetRegistryObject(senderChain, currencyId, 'polkadot')
  if(senderAssetObject === null) throw new Error(`Can't find asset in registry ${senderNode} | ${senderChain} | ${currencyId}`)

  // Check if asset is native to sender chain
  const assetOriginChain = findValueByKey(senderAssetObject?.tokenLocation, "Parachain")
  const isNative = senderChain === Number.parseInt(assetOriginChain)

  if (senderAssetObject.tokenLocation === undefined) throw new Error(`Asset does not have defined location ${senderNode} | ${senderChain} | ${currencyId}`)
  let assetMultilocation = senderAssetObject.tokenLocation as TokenLocation

  // If asset is native, configure multilocation accordingly
  let parentsValue = 1;
  if(isNative){
    assetMultilocation = removeParachain(assetMultilocation)
    parentsValue = 0
  }

  // const multiAsset = {
  //   V3: [
  //     {
  //       id: {
  //         Concrete: {
  //           parents: parentsValue,
  //           interior: assetMultilocation
  //         }
  //       },
  //       fun: {
  //         Fungible: amount
  //       }
  //     }
  //   ]
  // }
  const multiAsset = {
    V3: [
      {
        id: {
          Concrete: {
            parents: parentsValue,
            interior: assetMultilocation
          }
        },
        fun: {
          Fungible: amount
        }
      }
    ]
  }

  return multiAsset
}
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
type TokenLocationValue = Array<{ [key: string]: string }> | { [key: string]: string };
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
type TokenLocation = { [key: string]: TokenLocationValue } | "Here";

// Takes location and removes parachain value, if result is X1 then removes array aspect, if result is X0 then returns "Here"
function removeParachain(tokenLocation: TokenLocation): TokenLocation {
    if (typeof tokenLocation === "string") {
      return tokenLocation;
    }
  
    const result: TokenLocation = {};
  
    for (const [key, value] of Object.entries(tokenLocation)) {
      if (key === "X1" && typeof value === "object" && !Array.isArray(value)) {
        // Handle X1 case
        if ("Parachain" in value) {
          return "Here";
        } else {
          result[key] = value;
        }
      } else if (Array.isArray(value)) {
        const filteredValue = value.filter(item => !Object.keys(item).includes('Parachain'));
        
        if (filteredValue.length !== value.length) {
          // Parachain was removed, so we need to adjust the X key
          const newKey = key.startsWith('X') ? `X${parseInt(key.slice(1)) - 1}` : key;
          
          if (newKey === 'X1') {
            // If the new key is X1, we need to convert the array to a single object
            result[newKey] = filteredValue[0];
          } else {
            result[newKey] = filteredValue;
          }
        } else {
          // No Parachain was removed, keep the original key and value
          result[key] = filteredValue;
        }
      } else {
        // Handle non-array, non-X1 cases
        result[key] = value;
      }
    }
  
    return result;
  }
export default HydraDX
