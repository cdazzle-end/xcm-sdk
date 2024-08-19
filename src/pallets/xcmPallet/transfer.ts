// Contains basic call formatting for different XCM Palletss

import type { ApiPromise } from '@polkadot/api'
import { type Extrinsic, type TNode, type TSerializedApiCall } from '../../types'
import { getNode, callPolkadotJsTxFunction } from '../../utils'
import { getRelayChainSymbol, hasSupportForAsset } from '../assets'
import { checkDestinationSupportForAsset, getAssetByLocalId, getAssetBySymbolOrId } from '../assets/assetsUtils'
import { InvalidCurrencyError } from '../../errors/InvalidCurrencyError'
import { IncompatibleNodesError } from '../../errors'
import { AssetObjectNotFoundError } from '../../errors/AssetObjectError'
import { AssetNotXcmTransferrableError } from '../../errors/AssetNotXcmTransferrableError'
import { confirmNodesOnSameRelay } from './utils'

// Send function to use MyAssetRegistry instead of paraspell assets
// We can check for asset on destination chain by verifying asset with the same location exists on the destination chain
const sendCommonReworked = (
  api: ApiPromise,
  origin: TNode,
  assetId: string, // THIS is the main difference, always using local id as a string. 
  amount: string,
  to: string,
  destination?: TNode,
  serializedApiCallEnabled = false
): Extrinsic | TSerializedApiCall => {
  console.log(`sendCommonReworked function: Params: ${origin}, ${assetId}, ${amount}, ${to}, ${destination}`)

  const originAssetRegistryObject = getAssetByLocalId(origin, assetId)
  
  // Check if found asset object in registry
  if(originAssetRegistryObject == null){
    throw new AssetObjectNotFoundError(origin, assetId)
  }
  console.log(`sendCommonReworked function: Asset object token data: ${JSON.stringify(originAssetRegistryObject.tokenData)} `)

  // If asset has no location, throw xcm error
  if(!originAssetRegistryObject.hasLocation){
    throw new AssetNotXcmTransferrableError(origin, originAssetRegistryObject)
  }
  console.log(`sendCommonReworked function: Asset object location: ${JSON.stringify(originAssetRegistryObject.tokenLocation)}`)


  // Will throw if nodes on different relay or if asset not found on destination node
  if (destination !== undefined) {
    confirmNodesOnSameRelay(origin, destination)
    checkDestinationSupportForAsset(destination, originAssetRegistryObject)
  }

  const originNode = getNode(origin)

  return originNode.transfer(
    api,
    originAssetRegistryObject.tokenData.symbol,
    originAssetRegistryObject.tokenData.localId,
    amount,
    to,
    destination,
    serializedApiCallEnabled
  )
}

const sendCommon = (
  api: ApiPromise,
  origin: TNode,
  currencySymbolOrId: string | number | bigint,
  amount: string,
  to: string,
  destination?: TNode,
  serializedApiCallEnabled = false
): Extrinsic | TSerializedApiCall => {
  if (typeof currencySymbolOrId === 'number' && currencySymbolOrId > Number.MAX_SAFE_INTEGER) {
    throw new InvalidCurrencyError(
      'The provided asset ID is larger than the maximum safe integer value. Please provide it as a string.'
    )
  }
  
  const asset = getAssetBySymbolOrId(origin, currencySymbolOrId.toString())
  console.log(`sendCommon function: Params: ${origin}, ${currencySymbolOrId}, ${amount}, ${to}, ${destination} | Paraspell Asset: ${JSON.stringify(asset)}`)

  // Check transferring between nodes on same relay
  if (destination !== undefined) {
    const originRelayChainSymbol = getRelayChainSymbol(origin)
    const destinationRelayChainSymbol = getRelayChainSymbol(destination)
    if (originRelayChainSymbol !== destinationRelayChainSymbol) {
      throw new IncompatibleNodesError(origin, destination)
    }
  }

  const originNode = getNode(origin)

  if (asset === null && originNode.assetCheckEnabled) {
    throw new InvalidCurrencyError(
      `Origin node ${origin} does not support currency or currencyId ${currencySymbolOrId}.`
    )
  }
  let assetSymbol = asset?.symbol ?? "no symbol" ;
  console.log("Asset symbol: " + assetSymbol)
  if((origin === "Moonriver" || origin === "Moonbeam") && assetSymbol !== undefined && assetSymbol.toUpperCase().startsWith("XC")){
    assetSymbol = assetSymbol.substring(2);
  }
  if(destination === "Moonriver"  && assetSymbol !== undefined && assetSymbol.toUpperCase() !== "MOVR" && !assetSymbol.toUpperCase().startsWith("XC")){
    assetSymbol = "xc" + assetSymbol;
  }
  if(destination === "Acala" && (assetSymbol.toUpperCase() === "KUSD" || assetSymbol.toUpperCase() === "AUSD")){
    assetSymbol = "aSEED";
  }
  if(destination === "Moonbeam" && (assetSymbol.toUpperCase() === "KUSD" || assetSymbol.toUpperCase() === "ASEED")){
    assetSymbol = "AUSD";
  }

  // // Check for asset 
  // let assetSymbolCheck = false
  // if(destination !== undefined){
  //   assetSymbolCheck = hasSupportForAsset(destination, assetSymbol)
  // }

  // If destination node is specified, confirm destination supports asset
  if (
    destination !== undefined &&
    asset?.symbol !== undefined &&
    getNode(destination).assetCheckEnabled &&
    !hasSupportForAsset(destination, assetSymbol)
  ) {
    throw new InvalidCurrencyError(
      `Destination node ${destination} does not support currency or currencyId ${currencySymbolOrId}. Asset Symbol ${assetSymbol} | Destination: ${destination} | Origin: ${origin} | Asset: ${JSON.stringify(asset)}`
    )
  }

  if (asset === null) throw new Error(`sendCommon function failed, as 'asset' is null. Paraspell asset not found in paraspell registry`)
  const currencyId = originNode.assetCheckEnabled ? asset.assetId : currencySymbolOrId.toString()
  if(currencyId === undefined) throw new Error(`sendCommon function failed, as 'currencyId' is null`)
    // console.log("Buidling transfer")
  // console.log(`asset.symbol: ${asset?.symbol} | currencyId: ${currencyId}`)
  return originNode.transfer(
    api,
    assetSymbol,
    currencyId,
    amount,
    to,
    destination,
    serializedApiCallEnabled
  )
}

export const sendSerializedApiCall = (
  api: ApiPromise,
  origin: TNode,
  currencySymbolOrId: string | number | bigint,
  amount: string | number | bigint,
  to: string,
  destination?: TNode
): TSerializedApiCall => {
  return sendCommon(
    api,
    origin,
    currencySymbolOrId,
    amount.toString(),
    to,
    destination,
    true
  ) as TSerializedApiCall
}

// REVIEW Changing sendCommon to sendCommonReworked. Currency parameter currencySymbolOrId will always be the local ID now
export function send(
  api: ApiPromise,
  origin: TNode,
  // currencySymbolOrId: string | number | bigint,
  currencyId: any,
  amount: string | number | bigint,
  to: string,
  destination?: TNode
): Extrinsic {
  return sendCommonReworked(
    api,
    origin,
    currencyId,
    amount.toString(),
    to,
    destination
  ) as Extrinsic
}

export const transferRelayToParaCommon = (
  api: ApiPromise,
  destination: TNode,
  amount: string,
  address: string,
  serializedApiCallEnabled = false
): Extrinsic | TSerializedApiCall | never => {
  // console.log(`Destination: ${destination} | Amount: ${amount} | Address: ${address} | SerializedApiCallEnabled: ${serializedApiCallEnabled}`)
  const serializedApiCall = getNode(destination).transferRelayToPara({
    api,
    destination,
    address,
    amount
  })

  if (serializedApiCallEnabled) {
    return serializedApiCall
  }

  // console.log("Relay to para common: " + JSON.stringify(serializedApiCall, null,2))
  return callPolkadotJsTxFunction(api, serializedApiCall)
}

export function transferRelayToPara(
  api: ApiPromise,
  destination: TNode,
  amount: string | number | bigint,
  to: string
): Extrinsic | never {
  return transferRelayToParaCommon(api, destination, amount.toString(), to) as Extrinsic | never
}

export const transferRelayToParaSerializedApiCall = (
  api: ApiPromise,
  destination: TNode,
  amount: string | number | bigint,
  to: string
): TSerializedApiCall =>
  transferRelayToParaCommon(api, destination, amount.toString(), to, true) as TSerializedApiCall
