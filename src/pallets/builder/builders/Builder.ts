// Implements general builder pattern, this is Builder main file

import { type ApiPromise } from '@polkadot/api'
import { type Extrinsic, type TNode, type TSerializedApiCall } from '../../../types'
import AddLiquidityBuilder, { type AssetAAddLiquidityBuilder } from './AddLiquidityBuilder'
import BuyBuilder, { type AssetOutBuyBuilder } from './BuyBuilder'
import CloseChannelBuilder, { type InboundCloseChannelBuilder } from './CloseChannelBuilder'
import CreatePoolBuilder, { type AssetACreatePoolBuilder } from './CreatePoolBuilder'
import OpenChannelBuilder, { type MaxSizeOpenChannelBuilder } from './OpenChannelBuilder'
import RelayToParaBuilder from './RelayToParaBuilder'
import RemoveLiquidityBuilder, { type AssetARemoveLiquidityBuilder } from './RemoveLiquidityBuilder'
import SellBuilder, { type AssetInSellBuilder } from './SellBuilder'
import ParaToParaBuilder from './ParaToParaBuilder'
import ParaToRelayBuilder from './ParaToRelayBuilder'

class ToGeneralBuilder {
  private readonly api: ApiPromise
  private readonly from: TNode
  private readonly to: TNode

  constructor(api: ApiPromise, from: TNode, to: TNode) {
    this.api = api
    this.from = from
    this.to = to
  }

  // REVIEW Changed type to string from string | number | bigint
  currency(currency: string): AmountBuilder {
    return ParaToParaBuilder.createParaToPara(this.api, this.from, this.to, currency)
  }

  openChannel(): MaxSizeOpenChannelBuilder {
    return OpenChannelBuilder.create(this.api, this.from, this.to)
  }
}

class FromGeneralBuilder {
  private readonly api: ApiPromise
  private readonly from: TNode

  constructor(api: ApiPromise, from: TNode) {
    this.api = api
    this.from = from
  }

  to(node: TNode): ToGeneralBuilder {
    return new ToGeneralBuilder(this.api, this.from, node)
  }

  amount(amount: string | number | bigint): AddressBuilder {
    return ParaToRelayBuilder.create(this.api, this.from, amount)
  }

  closeChannel(): InboundCloseChannelBuilder {
    return CloseChannelBuilder.create(this.api, this.from)
  }
}

class GeneralBuilder {
  private readonly api: ApiPromise

  constructor(api: ApiPromise) {
    this.api = api
  }

  from(node: TNode): FromGeneralBuilder {
    return new FromGeneralBuilder(this.api, node)
  }

  to(node: TNode): AmountBuilder {
    return RelayToParaBuilder.create(this.api, node)
  }

  addLiquidity(): AssetAAddLiquidityBuilder {
    return AddLiquidityBuilder.create(this.api)
  }

  removeLiquidity(): AssetARemoveLiquidityBuilder {
    return RemoveLiquidityBuilder.create(this.api)
  }

  buy(): AssetOutBuyBuilder {
    return BuyBuilder.create(this.api)
  }

  sell(): AssetInSellBuilder {
    return SellBuilder.create(this.api)
  }

  createPool(): AssetACreatePoolBuilder {
    return CreatePoolBuilder.create(this.api)
  }
}

export const Builder = (api: ApiPromise): GeneralBuilder => {
  return new GeneralBuilder(api)
}

export interface FinalBuilder {
  build: () => Extrinsic | never
  buildSerializedApiCall: () => TSerializedApiCall
}

export interface AddressBuilder {
  address: (address: string) => FinalBuilder
}

export interface AmountBuilder {
  amount: (amount: string | number | bigint) => AddressBuilder
}
