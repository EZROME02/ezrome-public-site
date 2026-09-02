import {
  COOKIE_NAME,
  ONE_YEAR_MS,
  OAUTH_STATE_COOKIE,
  decodeOAuthState,
} from "@shared/const";
import { classifyOAuthCallback } from "@shared/oauthStatus";
import { parse as parseCookieHeader } from "cookie";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

function safeAuthRedirect(
  res: Response,
  reason: "cancelled" | "expired" | "error"
) {
  res.redirect(302, `/?oauth_error=${reason}`);
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    const providerError = getQueryParam(req, "error");
    const providerErrorDescription = getQueryParam(req, "error_description");

    if (providerError || providerErrorDescription) {
      if (!state) {
        safeAuthRedirect(res, "error");
        return;
      }

      try {
        const { nonce } = decodeOAuthState(state);
        const expectedNonce = parseCookieHeader(req.headers.cookie ?? "")[
          OAUTH_STATE_COOKIE
        ];
        if (!nonce || nonce !== expectedNonce) {
          safeAuthRedirect(res, "expired");
          return;
        }
        res.clearCookie(OAUTH_STATE_COOKIE, {
          path: "/",
          secure: true,
          sameSite: "none",
        });
      } catch {
        safeAuthRedirect(res, "expired");
        return;
      }

      safeAuthRedirect(
        res,
        classifyOAuthCallback({
          error: providerError,
          description: providerErrorDescription,
        })
      );
      return;
    }

    if (!code || !state) {
      safeAuthRedirect(res, "error");
      return;
    }

    try {
      const { nonce } = decodeOAuthState(state);
      const expectedNonce = parseCookieHeader(req.headers.cookie ?? "")[
        OAUTH_STATE_COOKIE
      ];
      if (!nonce || nonce !== expectedNonce) {
        safeAuthRedirect(res, "expired");
        return;
      }
      res.clearCookie(OAUTH_STATE_COOKIE, {
        path: "/",
        secure: true,
        sameSite: "none",
      });

      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        safeAuthRedirect(res, "error");
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      safeAuthRedirect(res, "error");
    }
  });
}
