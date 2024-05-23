// Contains basic call formatting for different XCM Palletss

import type { ApiPromise } from '@polkadot/api'
import { type Extrinsic, type TNode, type TSerializedApiCall } from '../../types'
import { getNode, callPolkadotJsTxFunction } from '../../utils'
import { getRelayChainSymbol, hasSupportForAsset } from '../assets'
import { getAssetBySymbolOrId } from '../assets/assetsUtils'
import { InvalidCurrencyError } from '../../errors/InvalidCurrencyError'
import { IncompatibleNodesError } from '../../errors'

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

  if (destination !== undefined) {
    const originRelayChainSymbol = getRelayChainSymbol(origin)
    const destinationRelayChainSymbol = getRelayChainSymbol(destination)
    if (originRelayChainSymbol !== destinationRelayChainSymbol) {
      throw new IncompatibleNodesError()
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
  // console.log("Starts with XC: " + assetSymbol.toUpperCase().startsWith("XC"))
  if((origin == "Moonriver" || origin == "Moonbeam") && assetSymbol != undefined && assetSymbol.toUpperCase().startsWith("XC")){
    assetSymbol = assetSymbol.substring(2);
  }
  if(destination == "Moonriver"  && assetSymbol != undefined && assetSymbol.toUpperCase() != "MOVR" && !assetSymbol.toUpperCase().startsWith("XC")){
    assetSymbol = "xc" + assetSymbol;
  }
  if(destination == "Acala" && assetSymbol.toUpperCase() == "KUSD" || assetSymbol.toUpperCase() == "AUSD"){
    assetSymbol = "aSEED";
  }
  if(destination == "Moonbeam" && assetSymbol.toUpperCase() == "KUSD" || assetSymbol.toUpperCase() == "ASEED"){
    assetSymbol = "AUSD";
  }

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

  const currencyId = originNode.assetCheckEnabled ? asset?.assetId : currencySymbolOrId.toString()

  console.log("Buidling transfer")
  return originNode.transfer(
    api,
    asset?.symbol,
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

export function send(
  api: ApiPromise,
  origin: TNode,
  currencySymbolOrId: string | number | bigint,
  amount: string | number | bigint,
  to: string,
  destination?: TNode
): Extrinsic {
  return sendCommon(
    api,
    origin,
    currencySymbolOrId,
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
  const serializedApiCall = getNode(destination).transferRelayToPara({
    api,
    destination,
    address,
    amount
  })

  if (serializedApiCallEnabled) {
    return serializedApiCall
  }

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
