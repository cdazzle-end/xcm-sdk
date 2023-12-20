// Contains function for getting Asset ID or Symbol used in XCM call creation

import { type TNode } from '../../types'
import { getAssetsObject } from './assets'
import * as allAssetsJson from '../../maps/allAssets.json'

import fs from 'fs';
import path from 'path';

export function getLocalId(assetSymbol: string | undefined, paraId: number): any {
  if(assetSymbol == undefined){
    throw new Error("Asset Symbol is undefined")
  }
  let allAssets: any[] = JSON.parse(JSON.stringify(allAssetsJson)).default;
  let assetData = allAssets.find((asset: any) => {
    if(asset.tokenData.symbol == assetSymbol && asset.tokenData.chain == paraId){
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

  const asset = [...otherAssets, ...nativeAssets].find(
    ({ symbol, assetId }) => {
      if(typeof symbolOrId === 'string'){
          symbolOrId = symbolOrId.toUpperCase()
      }
      return symbol?.toUpperCase() === symbolOrId || assetId === symbolOrId
      }
  )

  if (asset !== undefined) {
    const { symbol, assetId } = asset
    return { symbol, assetId }
  }

  if (relayChainAssetSymbol === symbolOrId) return { symbol: relayChainAssetSymbol }

  return null
}
