// Contains function for getting Asset ID or Symbol used in XCM call creation

import { type TNode } from '../../types'
import { getAssetsObject } from './assets'
import * as allAssetsKusama from '../../maps/allAssets.json'
import * as allAssetsPolkadot from '../../maps/allAssetsPolkadot.json'

import fs from 'fs';
import path from 'path';

type Relay = "Kusama" | "Polkadot"

export function getLocalId(assetSymbol: string | undefined, paraId: number, relay: Relay): any {
  if(assetSymbol == undefined){
    throw new Error("Asset Symbol is undefined")
  }
  let allAssets: any[] = relay == 'Kusama' ? JSON.parse(JSON.stringify(allAssetsKusama)).default  : JSON.parse(JSON.stringify(allAssetsPolkadot)).default
  let assetData = allAssets.find((asset: any) => {
    if(asset.tokenData.symbol.toLowerCase() == assetSymbol.toLowerCase() && asset.tokenData.chain == paraId){
        return true
    }
  })
  
  if(assetData == undefined){
    throw new Error("Asset Data is undefined")
  }
  return assetData.tokenData.localId
}
export const getAssetBySymbolOrId = (
  node: TNode,
  symbolOrId: string | number
): { symbol?: string; assetId?: string } | null => {
  const { otherAssets, nativeAssets, relayChainAssetSymbol } = getAssetsObject(node)
  // console.log(`paraspell function getAssetBySymbolOrID: Node: ${node} Getting asset symbol or ID: ${JSON.stringify(symbolOrId)}` )
  
  const asset = [...otherAssets, ...nativeAssets].find(
    ({ symbol, assetId }) => {
      // console.log("Asset symobl or id " + JSON.stringify(symbolOrId) + " --- " + symbol + " --- " + assetId)
      if(typeof symbolOrId === 'string'){
          return symbol?.toLowerCase() === symbolOrId.toLowerCase() || assetId?.toLowerCase() === symbolOrId.toLowerCase()
      } else {
          return symbol === symbolOrId.toString() || assetId === symbolOrId.toString()
      }
  })


  // console.log("Asset match in origin node: " + JSON.stringify(asset)) 
  if (asset !== undefined) {
    const { symbol, assetId } = asset
    return { symbol, assetId }
  }

  console.log("Dealing with XC")
  // For xc asset chains, account for the 'xc' prefix when sending to or receiving from
  if(node == "Moonriver" || node == "Shiden"){
      console.log("Origin node is Moonriver or Shiden, Make sure asset has XC prefix")
      const asset = [...otherAssets, ...nativeAssets].find(
          ({ symbol, assetId }) => {
            // console.log("Asset symobl or id " + JSON.stringify(symbolOrId) + " --- " + symbol + " --- " + assetId)
            if(typeof symbolOrId === 'string'){
              let prefixedSymbolOrId = "xc" + symbolOrId
              return symbol?.toLowerCase() === prefixedSymbolOrId.toLowerCase() || assetId?.toLowerCase() === prefixedSymbolOrId.toLowerCase()
            }
            else{
                return symbol === symbolOrId.toString() || assetId === symbolOrId.toString()
            }
        })
        if(asset != undefined){
          return asset
        }
  // Check if asset is coming from an xc chain, and remove the 'xc' prefix
  } else {
      console.log("Origin node is not Moonriver or Shiden, Make sure asset does not have XC prefix")
      const asset = [...otherAssets, ...nativeAssets].find(
          ({ symbol, assetId }) => {
            // console.log("Asset symobl or id " + JSON.stringify(symbolOrId) + " --- " + symbol + " --- " + assetId)
            if(typeof symbolOrId === 'string'){
              let noPrefixSymbolOrId = symbolOrId.toLowerCase().startsWith("xc") ? symbolOrId.slice(2) : symbolOrId
              return symbol?.toLowerCase() === noPrefixSymbolOrId.toLowerCase() || assetId?.toLowerCase() === noPrefixSymbolOrId.toLowerCase()

            }
            else{
                return symbol === symbolOrId.toString() || assetId === symbolOrId.toString()
            }
        })
        if(asset != undefined){
          return asset
        } 
  }

  if (relayChainAssetSymbol === symbolOrId) return { symbol: relayChainAssetSymbol }

  return null
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
