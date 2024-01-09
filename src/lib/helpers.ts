import config, { NETWORK } from "./config";

export function getNetworkDiscount(network: NETWORK) {
  const result = config.airtime.find((entry) => entry.network === network);
  return result?.discount;
}

export function getDataPlan(network: NETWORK, planCode: string) {
  switch (network) {
    case NETWORK["MTN"]:
      return config.internet["mtn"].find(
        (entry) => entry.planCode === planCode
      );
      break;
    case NETWORK["GLO"]:
      return config.internet["glo"].find(
        (entry) => entry.planCode === planCode
      );
      break;
    case NETWORK["9MOBILE"]:
      return config.internet["9mobile"].find(
        (entry) => entry.planCode === planCode
      );
      break;
    case NETWORK["AIRTEL"]:
      return config.internet["airtel"].find(
        (entry) => entry.planCode === planCode
      );
      break;
  }
}
