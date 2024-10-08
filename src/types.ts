//  derrived from https://github.com/kodadot/packages/blob/main/minimark/src/common/types.ts

import { type ApiPromise } from '@polkadot/api'
import { type SubmittableExtrinsic } from '@polkadot/api/types'
import {
  type NODES_WITH_RELAY_CHAINS,
  type NODE_NAMES,
  type SUPPORTED_PALLETS
} from './maps/consts'

export type UpdateFunction = (name: string, index: number) => string
export type Extrinsic = SubmittableExtrinsic<'promise'>
export type ExtrinsicFunction<T> = (arg: T) => Extrinsic
export type TRelayChainType = 'polkadot' | 'kusama'
export type TRelayChainSymbol = 'DOT' | 'KSM'
export type TNode = (typeof NODE_NAMES)[number]
export type TNodeWithRelayChains = (typeof NODES_WITH_RELAY_CHAINS)[number]
export interface TAssetDetails {
  assetId: string
  symbol?: string
  decimals?: number
}
export interface TNativeAssetDetails {
  assetId?: string
  symbol: string
  decimals: number
}
export interface TNodeAssets {
  paraId: number
  relayChainAssetSymbol: TRelayChainSymbol
  nativeAssets: TNativeAssetDetails[]
  otherAssets: TAssetDetails[]
}
export type TAssetJsonMap = Record<TNode, TNodeAssets>
export type TScenario = 'ParaToRelay' | 'ParaToPara' | 'RelayToPara'
export type Bool = 'Yes' | 'No'
export type TPallet = (typeof SUPPORTED_PALLETS)[number]
export interface TPalletMap {
  defaultPallet: TPallet
  supportedPallets: TPallet[]
}
export type TPalletJsonMap = Record<TNode, TPalletMap>

export interface TSerializedApiCall {
  module: string
  section: string
  parameters: any[]
}

// Removed undefined from currency and currencyId type, asthey will always be defined in our local asset registry
export interface XTokensTransferInput {
  api: ApiPromise
  currency: string
  currencyID: string
  amount: string
  addressSelection: any
  fees: number
  scenario: TScenario
  serializedApiCallEnabled?: boolean
}

export interface XTransferTransferInput {
  api: ApiPromise
  currency: string
  currencyID: string
  amount: string
  addressSelection: any
  fees: number
  scenario: TScenario
  serializedApiCallEnabled?: boolean
}

export interface IXTokensTransfer {
  transferXTokens: (input: XTokensTransferInput) => Extrinsic | TSerializedApiCall
}
export interface IXTokensTransferMultiassets {
  transferXTokensMultiassets: (input: XTokensTransferInput) => Extrinsic | TSerializedApiCall
}
export interface IXTransferTransfer{
  transferXTransfer: (input: XTransferTransferInput) => Extrinsic | TSerializedApiCall
}

export interface PolkadotXCMTransferInput {
  api: ApiPromise
  header: any // Location - chain id 
  addressSelection: any // Location - account address
  currencySelection: any // Location - multiasset
  scenario: TScenario
  currencySymbol: string | undefined
  serializedApiCallEnabled?: boolean
}

export interface TTransferRelayToParaOptions {
  api: ApiPromise
  destination: TNode
  address: string
  amount: string
}

export interface IPolkadotXCMTransfer {
  transferPolkadotXCM: (input: PolkadotXCMTransferInput) => Extrinsic | TSerializedApiCall
}

export enum Version {
  V1 = 'V1',
  V2 = 'V2',
  V3 = 'V3',
  V4 = 'V4'
}

// Custom types
export interface MyAssetRegistryObject {
  tokenData: MyAsset,
  hasLocation: boolean;
  tokenLocation?: string;
}

export interface MyAsset {
  network: string;
  chain: number;
  localId: string;
  name: string;
  symbol: string;
  decimals: string;
  minimalBalance?: string;
  deposit?: string;
  isFrozen?: boolean;
  contractAddress?: string;
}

// // TODO Refactor projects to use relay 'Polkadot' | 'Kusama' instead
// export type CustomRelay = 'kusama' | 'polkadot'