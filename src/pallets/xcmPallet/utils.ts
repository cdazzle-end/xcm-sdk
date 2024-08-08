import { IncompatibleNodesError } from '../../errors'
import type { Version, TTransferRelayToParaOptions, TNode } from '../../types'
import {
  createCurrencySpecification,
  createHeaderPolkadotXCM,
  generateAddressPayload
} from '../../utils'
import { getParaId, getRelayChainSymbol } from '../assets'
// import { getAssetRegistry } from '../assets/assetsUtils'

export const constructRelayToParaParameters = (
  { api, destination, address, amount }: TTransferRelayToParaOptions,
  version: Version,
  includeFee = false
): any[] => {
  const paraId = getParaId(destination)
  const parameters = [
    createHeaderPolkadotXCM('RelayToPara', version, paraId),
    generateAddressPayload(api, 'RelayToPara', null, address, version, paraId),
    createCurrencySpecification(amount, 'RelayToPara', version, destination),
    0
  ]
  if (includeFee) {
    parameters.push('Unlimited')
  }
  return parameters
}

// Custom utils
export const confirmNodesOnSameRelay = (
  origin: TNode,
  destination: TNode
): void => {
  if (destination !== undefined) {
    const originRelayChainSymbol = getRelayChainSymbol(origin)
    const destinationRelayChainSymbol = getRelayChainSymbol(destination)
    if (originRelayChainSymbol !== destinationRelayChainSymbol) {
      throw new IncompatibleNodesError(origin, destination)
    }
  }
}


// export function confirmNodesOnSameRelay(
//   origin: TNode,
//   destination: TNode
// ): void => {
//   if (destination !== undefined) {
//     const originRelayChainSymbol = getRelayChainSymbol(origin)
//     const destinationRelayChainSymbol = getRelayChainSymbol(destination)
//     if (originRelayChainSymbol !== destinationRelayChainSymbol) {
//       throw new IncompatibleNodesError()
//     }
//   }
// }