// リクエストパラメータ（クエリパラメータ、パスパラメータ、リクエストボディのパラメータ）起因のエラー
export class RequestError extends Error {
  constructor() {
    super();
    this.message = "RequestError: リクエストパラメータが不正です。";
  };
};
