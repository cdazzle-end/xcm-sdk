// Contains different useful asset query operations from compatible Parachains asset map

import * as assetsMapJson from '../../maps/assets.json' assert { type: 'json' }
import { NODE_NAMES } from '../../maps/consts'
import {
  type TNodeAssets,
  type TAssetJsonMap,
  type TNode,
  type TRelayChainSymbol,
  type TNativeAssetDetails,
  type TAssetDetails
} from '../../types'

const assetsMap = assetsMapJson as TAssetJsonMap

export const getAssetsObject = (node: TNode): TNodeAssets => assetsMap[node]

export const getAssetId = (node: TNode, symbol: string): string | null => {
  const info = getAssetsObject(node).otherAssets.find(o => o.symbol === symbol)
  return info != null ? info.assetId : null
}

export const getRelayChainSymbol = (node: TNode): TRelayChainSymbol =>
  getAssetsObject(node).relayChainAssetSymbol

/**
 * Get DOT asset to create para to relay trasaction. If node is evm chain, add XC to the symbol
 * 
 * @param node 
 */
export const getParaToRelayAssetSymbol = (node: TNode): string => {
  const relayChainSymbol = getRelayChainSymbol(node)
  return node === "Moonriver" || node === "Shiden" || node === "Moonbeam" || node === "Astar" ? `XC${relayChainSymbol}` : relayChainSymbol
}

export const getNativeAssets = (node: TNode): TNativeAssetDetails[] =>
  getAssetsObject(node).nativeAssets

export const getOtherAssets = (node: TNode): TAssetDetails[] => getAssetsObject(node).otherAssets

export const getAllAssetsSymbols = (node: TNode): string[] => {
  const { relayChainAssetSymbol, nativeAssets, otherAssets } = getAssetsObject(node)
  const nativeAssetsSymbols = nativeAssets.map(({ symbol }) => symbol)
  const otherAssetsSymbols = otherAssets
    .filter(asset => asset.symbol !== undefined)
    .map(({ symbol }) => symbol) as string[]
  return [relayChainAssetSymbol, ...nativeAssetsSymbols, ...otherAssetsSymbols]
}

export const hasSupportForAsset = (node: TNode, symbol: string): boolean =>{
  if((node === "Karura" || node === "Basilisk") && (symbol.toUpperCase() === "KUSD" || symbol.toUpperCase() === "AUSD" || symbol.toUpperCase() === "ASEED")){
    return true
  }

  return getAllAssetsSymbols(node).map((symbol) => symbol.toUpperCase()).includes(symbol.toUpperCase())
}
  

export const getAssetDecimals = (node: TNode, symbol: string): number | null => {
  const { otherAssets, nativeAssets } = getAssetsObject(node)
  const asset = [...otherAssets, ...nativeAssets].find(o => o.symbol?.toUpperCase() === symbol.toUpperCase())
  return asset?.decimals !== undefined ? asset.decimals : null
}

export const getParaId = (node: TNode): number => {
  return getAssetsObject(node).paraId
}

export const getTNode = (nodeID: number): TNode | null =>
  NODE_NAMES.find(node => getParaId(node) === nodeID) ?? null
