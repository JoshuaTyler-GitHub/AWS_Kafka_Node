import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

class UuidUtils {
  static collectedUuids = [];

  static generateUUID() {
    return uuidv4();
  }

  static isValidUuid(stringToValidate) {
    return uuidValidate(stringToValidate);
  }

  static uuid() {
    let newUUID = UuidUtils.generateUUID();
    while(UuidUtils.collectedUuids.includes(newUUID)) {
      newUUID = UuidUtils.generateUUID();
    }
    UuidUtils.collectedUuids.push(newUUID);
    return newUUID;
  }
}
export default UuidUtils;
