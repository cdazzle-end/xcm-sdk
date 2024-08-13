// Contains selection of compatible XCM pallet for each compatible Parachain and create transfer function

import { type ApiPromise } from '@polkadot/api'
import { NoXCMSupportImplementedError } from '../errors/NoXCMSupportImplementedError'
import { getParaId } from '../pallets/assets'
import {
  type TNode,
  type TRelayChainType,
  type Extrinsic,
  type TScenario,
  type IXTokensTransfer,
  type IXTokensTransferMultiassets,
  type IPolkadotXCMTransfer,
  type IXTransferTransfer,
  Version,
  type TSerializedApiCall,
  type TTransferRelayToParaOptions
} from '../types'
import {
  generateAddressPayload,
  getFees,
  createHeaderPolkadotXCM,
  createCurrencySpecification,
  getAllNodeProviders,
  createApiInstance
} from '../utils'
import { constructRelayToParaParameters } from '../pallets/xcmPallet/utils'

const supportsXTokens = (obj: any): obj is IXTokensTransfer => {
  return 'transferXTokens' in obj
}
const supportsXTokensTransferMultiassets = (obj: any): obj is IXTokensTransferMultiassets => {
  return 'transferXTokensMultiassets' in obj
}
const supportsPolkadotXCM = (obj: any): obj is IPolkadotXCMTransfer => {
  return 'transferPolkadotXCM' in obj
}

const supportsXTransfer = (obj: any): obj is IXTransferTransfer => {
  return 'transferXTransfer' in obj
}

abstract class ParachainNode {
  private readonly _node: TNode

  // Property _name maps our node names to names which polkadot libs are using
  // https://github.com/polkadot-js/apps/blob/master/packages/apps-config/src/endpoints/productionRelayKusama.ts
  // https://github.com/polkadot-js/apps/blob/master/packages/apps-config/src/endpoints/productionRelayPolkadot.ts
  // These names can be found under object key 'info'
  private readonly _name: string

  private readonly _type: TRelayChainType

  private readonly _version: Version

  protected _assetCheckEnabled = true

  constructor(node: TNode, name: string, type: TRelayChainType, version: Version) {
    this._name = name
    this._type = type
    this._node = node
    this._version = version
  }

  get name(): string {
    return this._name
  }

  get type(): TRelayChainType {
    return this._type
  }

  get node(): TNode {
    return this._node
  }

  get version(): Version {
    return this._version
  }

  get assetCheckEnabled(): boolean {
    return this._assetCheckEnabled
  }

  transfer(
    api: ApiPromise,
    currencySymbol: string,
    currencyId: string,
    amount: string,
    to: string,
    destination?: TNode,
    serializedApiCallEnabled = false
  ): Extrinsic | TSerializedApiCall {
    const scenario: TScenario = destination !== undefined ? 'ParaToPara' : 'ParaToRelay'
    const paraId = destination !== undefined ? getParaId(destination) : undefined

    // REVIEW If this is needed for more nodes, make it a more generic function
    // Handle multiassets transfer. HydraDX -> Asset Hub Polkadot
    if(this.node === "HydraDX" && destination === "AssetHubPolkadot" && supportsXTokensTransferMultiassets(this)){
      if(currencyId !== "10"){
        return this.transferXTokensMultiassets({
          api,
          currency: currencySymbol,
          currencyID: currencyId,
          amount,
          addressSelection: generateAddressPayload(
            api,
            scenario,
            'XTokens',
            to,
            this.version,
            paraId
          ),
          fees: getFees(scenario),
          scenario,
          serializedApiCallEnabled
        })
      }
    }


    if (supportsXTokens(this)) {
      // console.log("Building x tokens")
      // console.log(`currencySymbol: ${currencySymbol} | currencyId: ${currencyId}`)
      return this.transferXTokens({
        api,
        currency: currencySymbol,
        currencyID: currencyId,
        amount,
        addressSelection: generateAddressPayload(
          api,
          scenario,
          'XTokens',
          to,
          this.version,
          paraId
        ),
        fees: getFees(scenario),
        scenario,
        serializedApiCallEnabled
      })
    } else if(supportsXTransfer(this)){
      // console.log("Building xtransfer")
      return this.transferXTransfer({
        api,
        currency: currencySymbol,
        currencyID: currencyId,
        // location,
        amount,
        addressSelection: generateAddressPayload(
          api,
          scenario,
          'XTransfer',
          to,
          this.version,
          paraId
        ),
        fees: getFees(scenario),
        scenario,
        serializedApiCallEnabled
      })
    } 
    else if (supportsPolkadotXCM(this)) {
      return this.transferPolkadotXCM({
        api,
        header: createHeaderPolkadotXCM(scenario, this.version, paraId),
        addressSelection: generateAddressPayload(
          api,
          scenario,
          'PolkadotXcm',
          to,
          this.version,
          paraId
        ),
        currencySelection: createCurrencySpecification(
          amount,
          scenario,
          this.version,
          this._node,
          currencyId
        ),
        scenario,
        currencySymbol,
        serializedApiCallEnabled
      })
    } else {
      throw new NoXCMSupportImplementedError(this._node)
    }
  }

  transferRelayToPara(options: TTransferRelayToParaOptions): TSerializedApiCall {
    return {
      module: 'xcmPallet',
      section: 'reserveTransferAssets',
      parameters: constructRelayToParaParameters(options, Version.V3)
    }
  }

  getProvider(): string {
    return getAllNodeProviders(this.node)[0]
  }

  async createApiInstance(localProvider?: string | null): Promise<ApiPromise> {
    if (localProvider !== null && localProvider !== undefined) {
      return await createApiInstance(localProvider)
    }
    return await createApiInstance(this.getProvider())
  }
}

export default ParachainNode
