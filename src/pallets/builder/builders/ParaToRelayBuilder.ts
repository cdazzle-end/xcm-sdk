// Implements builder pattern for XCM message creation operations operation

import { type ApiPromise } from '@polkadot/api'
import { send, sendSerializedApiCall } from '../../xcmPallet'
import { type TSerializedApiCall, type Extrinsic, type TNode, TRelayChainType } from '../../../types'
import { getParaId, getParaToRelayAssetSymbol, getRelayChainSymbol } from '../../assets'
import { type AddressBuilder, type FinalBuilder } from './Builder'
import { getAssetRegistryObjectBySymbol } from '../../assets/assetsUtils'

class ParaToRelayBuilder implements AddressBuilder, FinalBuilder {
  private readonly api: ApiPromise
  private readonly from: TNode
  private readonly amount: string | number | bigint

  private _address: string

  private constructor(api: ApiPromise, from: TNode, amount: string | number | bigint) {
    this.api = api
    this.from = from
    this.amount = amount
  }

  static create(api: ApiPromise, from: TNode, amount: string | number | bigint): AddressBuilder {
    return new ParaToRelayBuilder(api, from, amount)
  }

  address(address: string): this {
    this._address = address
    return this
  }

  build(): Extrinsic {
    // const currency = getRelayChainSymbol(this.from)
    const currency = getParaToRelayAssetSymbol(this.from)
    const chainId = getParaId(this.from) 

    const relay: TRelayChainType = getRelayChainSymbol(this.from) === "DOT" ? "polkadot" : "kusama"

    const assetObject = getAssetRegistryObjectBySymbol(chainId, currency, relay)
    const currencyInput = JSON.stringify(assetObject.tokenData.localId).replace(/\\|"/g, "")
    return send(this.api, this.from, currencyInput, this.amount, this._address)
  }

  buildSerializedApiCall(): TSerializedApiCall {
    const currency = getRelayChainSymbol(this.from)
    return sendSerializedApiCall(this.api, this.from, currency, this.amount, this._address)
  }
}

export default ParaToRelayBuilder
