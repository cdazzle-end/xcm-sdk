import * as paraspell from '@paraspell/sdk'
import { WsProvider, ApiPromise } from '@polkadot/api'
// import { vi, describe, expect, it, beforeEach } from 'vitest'
// import { type Bool, type TNode } from '../../../types'
// import { createApiInstance } from '../../../utils'
// import * as hrmp from '../../hrmp'
// import * as parasSudoWrapper from '../../parasSudoWrapper'
// import * as xcmPallet from '../../xcmPallet'
// import * as xyk from '../../xyk'
// import { getRelayChainSymbol } from '../../assets'
// import { Builder } from './Builder'

const wsLocalKarura = "ws://172.26.130.75:8008"
const wsLocalBifrost = "ws://172.26.130.75:8015"

async function runBuilder(){
    const wsProvider = new WsProvider(wsLocalKarura)
    let api =  await ApiPromise.create({ provider: wsProvider })

    // let nodeOne: TNode = 'Karura'
    // let nodeTwo: Node = 'BifrostKusama'

    paraspell.Builder(api).from("Karura").to("BifrostKusama").currency('KAR').currencyId(16000).amount(1000000000000000).build()

    // paraspell.assets.getAssetId()
}

async function run(){

}