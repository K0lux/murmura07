declare module 'jsonwebtoken' {
  export interface SignOptions {
    expiresIn?: string | number;
  }

  export function sign(
    payload: string | Record<string, unknown> | Buffer,
    secretOrPrivateKey: string,
    options?: SignOptions
  ): string;

  export function verify(token: string, secretOrPublicKey: string): string | Record<string, unknown>;

  const jwt: {
    sign: typeof sign;
    verify: typeof verify;
  };

  export default jwt;
}
