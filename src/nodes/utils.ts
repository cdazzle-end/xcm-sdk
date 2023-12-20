import fs from 'fs';
import path from 'path';

export function getLocalId(assetSymbol: string, paraId: number): any {
  let allAssets = JSON.parse(fs.readFileSync(path.join(__dirname, "../maps/allAssets.json"), 'utf8'));
  let assetData = allAssets.find((asset: any) => {
    if(asset.tokenData.symbol == assetSymbol && asset.tokenData.chain == paraId){
        return true
    }
  })
  return assetData.tokenData.localId
}
// getLocalId("KBTC", 2001)