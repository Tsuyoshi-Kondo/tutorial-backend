import { JwtPayload } from "jsonwebtoken";
import sinon from "sinon"
import {mockReq, mockRes} from "sinon-express-mock"

import { checkJwtHasPermission } from "../middleware/checkJwtHasPermission"
import * as JWTManager from "../middleware/JWTManager";

// ミドルウェアcheckHasPermissionのテストは最終的に呼び出されるnext()が呼ばれたら正常とする

// テスト対象の関数に含まれている関数のモック化
jest.mock("../middleware/JWTManager");
const JWTManagerMock = JWTManager as jest.Mocked<typeof JWTManager>;

describe("checkJWTHasPermissionのテスト", () => {
  test("next()が呼ばれることを確認する - 正常系", async () => {
    const req = mockReq({
      Headers: {
        "x-auth-token": "token",
      },
      params: {
        userId: "1",
      }
    });
    const res = mockRes();

    // next関数のスパイを作成
    // スパイ：関数が呼ばれたかどうか、何回呼ばれたか、などをチェック（監視）するためのモノ
    const next = sinon.spy();

    const decoded = {
      id: "1"
    } as JwtPayload;
    JWTManagerMock.inspectionToken.mockImplementation(()=>Promise.resolve(decoded));

    await checkJwtHasPermission(req, res, next);
    // 1回呼ばれているかどうかを確認
    expect(next.calledOnce).toBe(true);
  });

  // クエストヘッダーにx-auth-tokenにundefinedを定義しているができない
  test("リクエストヘッダーにx-auth-tokenがundefinedの場合にnext()が呼ばれないことを確認 - 準正常系", async () => {
    const req = mockReq({
      Headers: {
        "x-auth-token": undefined,
      },
      params: {
        userId: "1",
      },
    });
    const res = mockRes();
    const next = sinon.spy();

    const decoded = {
      id: "1"
    } as JwtPayload;
    JWTManagerMock.inspectionToken.mockImplementation(()=>Promise.resolve(decoded));

    await checkJwtHasPermission(req, res, next);
    // 1回呼ばれているかどうかを確認
    expect(next.calledOnce).toBe(false);
  })

  test("JWT中のユーザーidとリクエストパラメーター中のユーザーidが異なる場合にnext()が呼ばれないことを確認 - 準正常系", async () => {
    const req = mockReq({
      Headers: {
        "x-auth-token": undefined,
      },
      params: {
        userId: "2",
      },
    });
    const res = mockRes();
    const next = sinon.spy();

    const decoded = {
      id: "1"
    } as JwtPayload;
    JWTManagerMock.inspectionToken.mockImplementation(()=>Promise.resolve(decoded));

    await checkJwtHasPermission(req, res, next);
    // 1回呼ばれているかどうかを確認
    expect(next.calledOnce).toBe(false);
  });
});
