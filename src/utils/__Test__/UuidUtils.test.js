// Global Libraries
import LoggerUtils from "../LoggerUtils.js";

// Testing Library
import UuidUtils from "../UuidUtils.js";

beforeAll(() => {
  LoggerUtils.initialize("TESTING");
});

// generateUuid
test("generateUuid()", () => {
  const uuid = UuidUtils.generateUUID();
  expect(UuidUtils.isValidUuid(uuid)).toEqual(true);
});

// isValidUuid
test("isValidUuid()", () => {
  // valid
  const uuidV1 = "d9428888-122b-11e1-b85c-61cd3cbb3210";
  const uuidV2 = "109156be-c4fb-41ea-b1b4-efe1671c5836";
  const uuidV3 = "a981a0c2-68b1-35dc-bcfc-296e52ab01ec";
  const uuidV4 = "90123e1c-7512-523e-bb28-76fab9f2f73d";
  expect(UuidUtils.isValidUuid(uuidV1)).toEqual(true);
  expect(UuidUtils.isValidUuid(uuidV2)).toEqual(true);
  expect(UuidUtils.isValidUuid(uuidV3)).toEqual(true);
  expect(UuidUtils.isValidUuid(uuidV4)).toEqual(true);

  // invalid
  expect(UuidUtils.isValidUuid()).toEqual(false);
  expect(UuidUtils.isValidUuid(1)).toEqual(false);
  expect(UuidUtils.isValidUuid(true)).toEqual(false);
  expect(UuidUtils.isValidUuid(false)).toEqual(false);
  expect(UuidUtils.isValidUuid("")).toEqual(false);
  expect(UuidUtils.isValidUuid("invalid uuid string")).toEqual(false);
  expect(UuidUtils.isValidUuid("523e-bb28-76fab9f2f73d")).toEqual(false);
});

// uuid
test("uuid()", () => {
  // duplicateId
  const duplicateId = "90123e1c-7512-523e-bb28-76fab9f2f73d";

  // mockGenerateUUID
  const mockSwitch = UuidUtils.generateUUID;
  UuidUtils.generateUUID = () => {
    // reset mock after called once
    UuidUtils.generateUUID = mockSwitch;
    return duplicateId;
  };

  // force duplicateId scenario
  UuidUtils.collectedUuids = [duplicateId];
  const uuid = UuidUtils.uuid();
  expect(String(uuid) === String(duplicateId)).toEqual(false);
  expect(UuidUtils.isValidUuid(uuid)).toEqual(true);
  expect(UuidUtils.collectedUuids.includes(uuid)).toEqual(true);
});
