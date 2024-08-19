// Contains function for getting Asset ID or Symbol used in XCM call creation

// import { type TNode } from '../../types'
import type { MyAssetRegistryObject, TNode, TRelayChainType } from '../../types'
import { getAssetsObject, getParaId } from './assets'
import * as allAssetsKusama from '../../maps/allAssets.json'
import * as allAssetsPolkadot from '../../maps/allAssetsPolkadot.json'
import fs from 'fs'
import path from 'path'
import { AssetDestinationError } from '../../errors/AssetDestinationError'
import { getNode } from '../../utils'

// import fs from 'fs';
// import path from 'path';

type Relay = "Kusama" | "Polkadot"

export function getLocalId(assetSymbol: string | undefined, paraId: number, relay: Relay): any {
  if(assetSymbol === undefined){
    throw new Error("Asset Symbol is undefined")
  }
  const allAssets: any[] = relay === 'Kusama' ? JSON.parse(JSON.stringify(allAssetsKusama)).default  : JSON.parse(JSON.stringify(allAssetsPolkadot)).default
  const assetData = allAssets.find((asset: any) => {
    if(asset.tokenData.symbol.toLowerCase() === assetSymbol.toLowerCase() && asset.tokenData.chain === paraId){
        return true
    }
    return false
  })
  
  if(assetData === undefined){
    throw new Error("Asset Data is undefined")
  }
  return assetData.tokenData.localId
}
export const getAssetBySymbolOrId = (
  node: TNode,
  symbolOrId: string | number
): { symbol?: string; assetId?: string } | null => {
  const { otherAssets, nativeAssets, relayChainAssetSymbol } = getAssetsObject(node)

  const asset = [...otherAssets, ...nativeAssets].find(
    ({ symbol, assetId }) => {
      // console.log("Asset symobl or id " + JSON.stringify(symbolOrId) + " --- " + symbol + " --- " + assetId)
      if(typeof symbolOrId === 'string'){
          return symbol?.toLowerCase() === symbolOrId.toLowerCase() || assetId?.toLowerCase() === symbolOrId.toLowerCase()
      } else {
          return symbol === symbolOrId.toString() || assetId === symbolOrId.toString()
      }
  })

  if (asset !== undefined) {
    const { symbol, assetId } = asset
    return { symbol, assetId }
  }

  console.log("Dealing with XC")
  // For xc asset chains, account for the 'xc' prefix when sending to or receiving from
  if(node === "Moonriver" || node === "Shiden"){
      console.log("Origin node is Moonriver or Shiden, Make sure asset has XC prefix")
      const asset = [...otherAssets, ...nativeAssets].find(
          ({ symbol, assetId }) => {
            // console.log("Asset symobl or id " + JSON.stringify(symbolOrId) + " --- " + symbol + " --- " + assetId)
            if(typeof symbolOrId === 'string'){
              const prefixedSymbolOrId = "xc" + symbolOrId
              return symbol?.toLowerCase() === prefixedSymbolOrId.toLowerCase() || assetId?.toLowerCase() === prefixedSymbolOrId.toLowerCase()
            }
            else{
                return symbol === symbolOrId.toString() || assetId === symbolOrId.toString()
            }
        })
        if(asset !== undefined){
          return asset
        }
  // Check if asset is coming from an xc chain, and remove the 'xc' prefix
  } else {
      console.log("Origin node is not Moonriver or Shiden, Make sure asset does not have XC prefix")
      const asset = [...otherAssets, ...nativeAssets].find(
          ({ symbol, assetId }) => {
            // console.log("Asset symobl or id " + JSON.stringify(symbolOrId) + " --- " + symbol + " --- " + assetId)
            if(typeof symbolOrId === 'string'){
              const noPrefixSymbolOrId = symbolOrId.toLowerCase().startsWith("xc") ? symbolOrId.slice(2) : symbolOrId
              return symbol?.toLowerCase() === noPrefixSymbolOrId.toLowerCase() || assetId?.toLowerCase() === noPrefixSymbolOrId.toLowerCase()

            }
            else{
                return symbol === symbolOrId.toString() || assetId === symbolOrId.toString()
            }
        })
        if(asset !== undefined){
          return asset
        } 
  }

  if (relayChainAssetSymbol === symbolOrId) return { symbol: relayChainAssetSymbol }

  return null
}

// Instead of getting paraspell asset ({symbol, id}), check for and retrieve asset registry object from local registry
export const getAssetByLocalId = (
  node: TNode,
  assetId: string
): MyAssetRegistryObject | null => {

  const nodeData = getAssetsObject(node)
  const paraId = nodeData.paraId
  const relayAssetSymbol = nodeData.relayChainAssetSymbol
  
  const relayChain: TRelayChainType = relayAssetSymbol === 'DOT' ? 'polkadot' : 'kusama' 
  const assetRegistryObject: MyAssetRegistryObject | null = getAssetRegistryObject(paraId, assetId, relayChain)

  return assetRegistryObject

}

// TODO Make asset registry a dynamic import, not a static file read from absolute path
export function getAssetRegistry(relay: TRelayChainType): MyAssetRegistryObject[]{
  // Using absolute path because paraspell is imported into arb-executor
  const polkadotAssetsDir = 'C:/Users/dazzl/CodingProjects/substrate/polkadot_assets/assets/asset_registry'
  const assetRegistryPath = relay === 'kusama' ? 'allAssetsKusamaCollected.json' : 'allAssetsPolkadotCollected.json'
  const assetRegistry: MyAssetRegistryObject[] = JSON.parse(fs.readFileSync(path.join(polkadotAssetsDir, assetRegistryPath), 'utf8'));
  return assetRegistry
}

// Instead of throwing error here, we return null, and throw the error higher up where there is more context
export function getAssetRegistryObject(paraId: number, localId: string, relay: TRelayChainType): MyAssetRegistryObject | null{
  const assetRegistry: MyAssetRegistryObject[] = getAssetRegistry(relay)
  const asset = assetRegistry.find((assetRegistryObject: MyAssetRegistryObject) => {
      if(paraId === 0 && assetRegistryObject.tokenData.chain === 0){
          return true
      }
      // console.log(JSON.stringify(assetRegistryObject.tokenData.localId).replace(/\\|"/g, ""))
      return assetRegistryObject.tokenData.chain === paraId && JSON.stringify(assetRegistryObject.tokenData.localId).replace(/\\|"/g, "") === localId
  })
  if(asset === undefined){
      throw new Error(`Balance Adapter: Asset not found in registry: chainId: ${paraId}, localId: ${localId} | localId stringify: ${JSON.stringify(localId)}`)
      // throw new AssetObjectNotFound(localId, paraId)
      // return null
  }
  return asset
}

export function getAssetsAtLocation(assetRegistryObject: MyAssetRegistryObject, relay: TRelayChainType): MyAssetRegistryObject[] {
  const assetRegistry: MyAssetRegistryObject[] = getAssetRegistry(relay)

  // Previous function
  // const assetsAtLocation: MyAssetRegistryObject[] = assetRegistry
  //     .map((assetObject) => {
  //         if (JSON.stringify(assetObject.tokenLocation) === JSON.stringify(assetLocationObject)) {
  //             return assetObject;
  //         }
  //         // return undefined
  //     })
  //     .filter((assetObject): assetObject is MyAssetRegistryObject => assetObject !== undefined);

  // Refactored function
  const assetsAtLocation: MyAssetRegistryObject[] = assetRegistry
    .filter((assetObject) => 
      JSON.stringify(assetObject.tokenLocation) === JSON.stringify(assetRegistryObject.tokenLocation)
    );

  return assetsAtLocation;
}

export const checkDestinationSupportForAsset = (destination: TNode, assetRegistryObject: MyAssetRegistryObject): void => {
  const nodeData = getNode(destination)
  const assetsAtLocation: MyAssetRegistryObject[] = getAssetsAtLocation(assetRegistryObject, nodeData.type)


  const paraId = getParaId(destination)
  const destinationAsset = assetsAtLocation.find((asset) => asset.tokenData.chain === paraId)
  if(destinationAsset === undefined){
    throw new AssetDestinationError(assetRegistryObject, destination)
  }
}

export function findValueByKey(obj: any, targetKey: any): any {
    if (typeof obj !== 'object' || obj === null) {
        return null;
    }
    for (const key in obj) {
        if (key === targetKey) {
            return obj[key];
        }

        const foundValue: any = findValueByKey(obj[key], targetKey);
        if (foundValue !== null) {
            return foundValue;
        }
    }
    return null;
}
// export const getAssetBySymbolOrId = (
//   node: TNode,
//   symbolOrId: string | number
// ): { symbol?: string; assetId?: string } | null => {
//   const { otherAssets, nativeAssets, relayChainAssetSymbol } = getAssetsObject(node)
//   console.log("Getting asset symbol or ID: " + JSON.stringify(symbolOrId))
//   console.log("Other Assets: " + JSON.stringify(otherAssets))
//   console.log("Native Assets: " + JSON.stringify(nativeAssets))

//   const asset = [...otherAssets, ...nativeAssets].find(
//     ({ symbol, assetId }) => {
//       // console.log("Asset symobl or id " + JSON.stringify(symbolOrId) + " --- " + symbol + " --- " + assetId)
//       if(typeof symbolOrId === 'string'){
//           return symbol?.toLowerCase() === symbolOrId.toLowerCase() || assetId?.toLowerCase() === symbolOrId.toLowerCase()
//       }
//       else{
//           return symbol === symbolOrId.toString() || assetId === symbolOrId.toString()
//       }
//   })
// console.log("Asset: " + JSON.stringify(asset))
//   if (asset !== undefined) {
//     const { symbol, assetId } = asset
//     return { symbol, assetId }
//   }

//   if (relayChainAssetSymbol === symbolOrId) return { symbol: relayChainAssetSymbol }

//   return null
// }
