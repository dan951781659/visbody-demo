# Mobile Prototype Agent Guide

## Project memory

- 每次项目对话开始前读取本目录 `PROJECT_MEMORY.md`，结合用户最新要求继续工作。
- 每次回复结束前更新该文件中的当前状态、决策或交流日志；纯讨论也记录结论，无实质变化时记录简短状态。记录实际完成与验证范围，不将计划写成完成。
- 保留重要决定的历史，注明被取代的规则；禁止写入凭据、令牌或真实个人健康数据。此要求适用于在本工程上下文中的后续对话。

## Prototype Instructions

In ChatGPT Work Mode, run `sites-preview start "$PWD"`, open `http://terminal.local:4173/` in the cloud browser, and verify the rendered app and its primary interactions. Keep that preview open and tell the user to inspect it in the cloud browser; do not present the local URL as a user-facing chat link. In Codex Desktop, run the local server yourself, open the preview in the in-app browser, and provide the clickable local URL. Do not deploy to Sites unless the user explicitly asks to share, publish, or deploy. Do not give the user server-start instructions when you can run it.

Before planning or implementing any mobile-app change, read this `AGENTS.md` in full. It is the source of truth for the template's runtime and component guidance.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Editing Boundary

- Build app-specific UI in `src/Prototype.tsx` and `src/prototype.css`.
- Treat `src/App.tsx`, `src/main.tsx`, `src/styles.css`, `src/mobile/`, `public/assets/iphone/`, `public/assets/android/`, `public/assets/status/`, `vite.config.ts`, `worker/index.js`, and `scripts/prepare-sites-build.mjs` as protected runtime files. Do not edit, replace, remove, or recreate them unless the user explicitly asks to change the mobile runtime itself. For an explicit runtime change, update the affected lock hashes only after verifying the new runtime behavior.
- Run `npm run check:runtime` before preview or handoff. If it fails, restore the protected runtime instead of weakening or bypassing the check.
- `npm run build` preserves the mobile runtime and prepares the static Cloudflare Worker output required by Sites. Before a Sites handoff, confirm `dist/client/index.html`, `dist/server/index.js`, `dist/.openai/hosting.json`, and source `.openai/hosting.json` exist, then run `npm run test:sites`. Do not replace this project with a Vinext starter.

## Runtime Contract

- Preserve the mobile device runtime unless the user's task explicitly asks otherwise. Do not replace it with a standalone page. Visual fidelity applies to app-owned content inside the device screen, not to template-owned device chrome.
- Keep `App` composed around `PhoneFrame` -> `KeyboardProvider`, with `StatusBar`, app content, `HomeIndicator`, and `KeyboardDock` mounted inside the phone frame. `StatusBar` and the iOS home indicator are overlaid device chrome. When the Android keyboard is closed, the app viewport reserves the protected navigation-bar region instead of painting behind it. When the Android keyboard is open, preserve the current full-screen keyboard layout: its asset includes the IME navigation strip and the separate black navigation bar is hidden. iOS screens continue to paint behind the home-indicator area and own their safe-area content padding.
- Preserve the `iPhone` / `Pixel 10` device picker and both calibrated device presets. The Pixel screen is `427 x 952`; its `32 x 32` camera circle and `public/assets/android/navigation-bar.svg` bottom navigation bar are protected device chrome, not app content.
- Preserve the device picker's intentionally lightweight Codex styling in the top-right corner: its trigger wrapper is borderless and transparent, its trigger sizes to content, and its right-aligned menu uses the compact 3px inset plus the specified hairline and elevation shadow layers. Keep the prototype root and default app screen white.
- Preserve `StatusBar` as live device chrome, including its platform-specific typography, source status-icon assets, and spacing. Pixel 10 uses Roboto, Android indicators, and 32px top, left, and right padding. iPhone uses its iOS indicators, system typography, and calibrated spacing. Do not hardcode screenshot times like `9:41` into the status bar, replace its real-time clock, or move status bar content into app markup unless the user explicitly asks for a fixed/mock device time.
- `PhoneFrame` owns the calibrated device frame, screen portal, device picker, camera cutout, and custom cursor. Keep device assets in `public/assets/iphone/` and `public/assets/android/`; if an asset fails to load, repair the asset path or restore the asset instead of removing the frame, keyboard, or image render.
- Use `MobileScroll` directly for simple single-screen prototypes. Use `FlowStack` for conventional multi-screen flows whose routes can own their fixed header and footer; when using it, define each route as a `FlowScreen`: `{ id, header?, headerHeight?, footer?, footerHeight?, render }`, and use `flow.push(screen)`, `flow.pop()`, and `flow.replace(screen)` from `FlowStack` render callbacks or `useFlow()` instead of introducing another router.
- Use `Carousel` for a carousel, horizontal rail, swipeable cards, image or media strip, horizontally scrollable cards, chip rail, or other horizontal collection.
- For a layered app shell—such as a persistent composer, independently presented sheet, pushed/peek sidebar, or app-wide transition—compose directly in `Prototype.tsx` rather than forcing it through `FlowStack`. Keep app-owned fixed chrome as sibling layers outside `MobileScroll`.
- When using `FlowScreen`, put route-owned fixed headers or footers in `FlowScreen.header` or `FlowScreen.footer`. Set `headerHeight` to the visible app-toolbar height; `FlowStack` adds the device's top safe-area/status-bar inset automatically. Do not include `StatusBar` or its height in the header. Set `footerHeight` to the full app-footer height. `FlowScreen.footer` is an overlay, not reserved layout space; screens using it must add their own bottom content padding such as `padding-bottom: calc(var(--flow-footer-height) + var(--mobile-safe-area-height) + 24px)` so final content can scroll above the footer while still painting behind it.
- Render only scrollable content inside `MobileScroll`; it is for content that should move with scroll and rubber-band overscroll. Keep app-owned headers, nav bars, tabs, composers, and overlays outside it. This keeps scroll physics, safe areas, keyboard insets, scrollbars, and drag click suppression active without letting content paint under fixed chrome.
- Buttons, links, cards, and images inside `MobileScroll` should still allow drag scrolling when the pointer moves beyond tap slop. Use `data-scroll-drag="ignore"` only for rare controls that must own the drag gesture themselves.
- Do not add `var(--keyboard-height)` to ordinary screen/content padding inside `MobileScroll`; the scroll viewport already shrinks above the simulated keyboard. For custom fixed composers, search bars, or toast chrome, use `useKeyboardInsets().bottomInset`. It is relative to the app viewport: Android returns `0` while the closed-keyboard viewport already reserves navigation, then returns the keyboard height while open; iOS continues to clear the home indicator while closed and ride directly above the keyboard while open. Do not pin custom bottom chrome to `bottom: 0` or only `keyboardHeight`.
- Use `KeyboardInput`, `KeyboardTextarea`, or `MobileTextField` for every text-entry control. A raw `input` or `textarea` disconnects focus, keyboard animation, safe-area insets, and attached surfaces.
- Use `BottomSheet` for phone-scoped sheets. Its props are `open`, `onOpenChange`, `title`, optional `description`, optional `snap`, and `children`; it renders through the phone screen portal and dismisses the keyboard before opening.

## Horizontal Carousels

- Use `Carousel` for horizontally draggable cards, images, media, chips, or other horizontal collections. Do not recreate these with `overflow-x`, custom pointer handlers, or a generic div.
- `Carousel` can be nested directly inside `MobileScroll`. It owns horizontal gestures and automatically yields vertical gestures to the parent.
- Never put `data-scroll-drag="ignore"` on or around a `Carousel`; doing so prevents vertical parent scrolling when a gesture begins inside it.
- Do not add CSS scroll snapping to `Carousel`; its runtime owns momentum and release motion.
- Use `data-scroll-drag="ignore"` only when a control must prevent parent scrolling in every drag direction.

See `src/mobile/COMPONENTS.md` for the full component and gesture contract.

## WellnessHub H5 durable design decisions

- v0.2.13 国内手机号绑定页与固定登录页共用 ChinaLogin，沿用海外 auth-page/login-page 的布局、品牌、Prefs、字段与按钮样式。绑定页不使用详情页固定标题栏，返回微信授权置于表单辅助区；保留绑定操作及原报告跳转语义。

- v0.2.14 homepage interaction plan is confirmed and implemented: every summary count opens a matching filtered stage-findings detail page with traceable measurement evidence; label counts as modules. Keep only one interactive metric-trend section. The main Demo shows both AI and training generated through in-memory fixtures, without on-page service-state debugging controls; never persist these as personal service results. Shape comparison uses two explicitly simulated geometries derived from one asset, not two real scans; support synchronized rotation, overlay, date selection and view controls. Retain meaningful entry, selection, detail and 3D transitions, reduced-motion support, and return-state restoration. Existing isolated service preview routes remain available.

- v0.2.11 homepage is a longitudinal body-status overview, not a thumbnail of the latest report. Fixed entry and ordinary sign-in open the homepage; device scan, measurement completion, and report notifications open their bound report. The homepage defaults to the latest seven valid batches in the latest device/comparison stream, shows the real date span and module coverage, and treats missing measurements as unknown rather than normal. Metric trends use each metric's latest seven comparable observations. AI remains report-bound; training is the user's current service and does not depend on AI. Keep the latest report as a secondary end-of-page entry and do not restore the user's name, one-off score, large current 3D model, or latest-report finding summary to the first screen.

- v0.2.10 国内微信流程遵循“登录前分流、身份确认后合流”。新用户扫码后仅静默识别、关注公众号并从报告生成通知进入授权/手机号绑定；已绑定微信的老用户有两条并行路径：扫码后立即打开本次报告（未合成时显示等待页，完成后自动打开），且报告合成成功时同时发送公众号通知，供退出后的独立回看。老用户的两条路径均绝不重复展示微信授权、手机号绑定或中间识别页。国内固定链接复用海外登录版式，手机号验证码为主、微信为第三方入口，非微信环境仅保留手机号。国内身份确认后必须进入标准 UserPrototype，禁止再渲染国内专属报告壳或游客只读壳。所谓“恢复已绑定账号登录态”只指服务端复用/签发同一既有账号的 H5 会话，绝非新建用户账号。

- v0.2.12 国内扫码与通知页仅能在微信内打开；非微信环境不得展示或推断报告内容，只提示回微信打开。新用户关注后，报告未生成时必须显示可恢复的“已关注公众号”状态页；报告生成后以通知承接授权/绑定。通知发送失败不能阻断已绑定老用户的扫码查看，只能进入标准首页作为 Demo 兜底；真实系统由服务端重试和报告列表回看。通知正文仅可显示报告生成、机构与时间，不能泄露健康结论或数值。所有扫码/通知访问必须由服务端按报告范围、接收微信身份、有效期和撤销状态校验，禁止以 reportId 作为凭证。

- v0.2.6 guest entry is a full-width secondary button with the same 48px height and 9px radius as the primary sign-in button. Center the label「游客模式」, use a hairline border and brand-blue text, and do not restore the icon tile, chevron, or card shadow. The login page does not show the local Demo notice, the persistent scan instruction, or the exit-guest button. A missing scan still reports in the form error slot when the button is pressed. Report pages may keep the exit action.

- v0.2.4 guest entry shows title only, no subtitle. Guest basic profile has no Mock footer or exit action; keep its back navigation. Put age/height ranges in the corresponding input placeholders and show localized field errors only for invalid input, retaining disabled submit until all required data is valid.

- v0.2.3 guest access supersedes sample-data browsing: device scan → login → required age (10–99), gender and height (100–230 cm) → the QR-bound report. Never auto-bind a report when scan context is missing. Guests have an isolated, tab-scoped sessionStorage context; do not modify registered-user data or session. Generated AI and training are independent, permission-checked read-only services; hide history, personal navigation and all write/share actions. Public Mock QR examples are not production credentials; real access checks and calculations must be server-side.

- v0.2 original-version homepage uses: latest measured overview with first-screen 3D → independent AI/training services → up to three measured concerns with expandable positive findings → one four-metric trend chart. This supersedes the old homepage's repeated report/insight/outline lists; do not import the 童允强-version layout.
- Homepage values and dates must come from the user's report collection. Do not substitute profile weight, fabricate trend days, or repopulate deleted reports. Compare only the same device and metric definition.
- AI interpretation and training are independent services. A global Demo outline is not a personal generated result. Only validated content linked to an existing report may appear as ready; identify historical content explicitly. Health profiles are not equivalent to basic height/weight profile fields.
- Base reports remain viewable. Future B-provided/C-paid flows must not recharge existing generated content and must not make AI a prerequisite for training. Payment, real generation and B-side access control are outside v0.2.
- Before any subsequent release, snapshot the current original project, increment its version, and document recovery. Never overwrite an earlier snapshot or change the 童允强 directory as part of original-version work.
- Treat `/Users/kean/Documents/体测线/h5-adjust-react` as the canonical source for the Home, My, training outline, training plan, 3D model, mock data, and related interaction patterns. Merge those pieces into this app rather than replacing them with simplified interpretations.
- Treat `/Users/kean/Documents/wellnesshub-H5/uni-report-master` as the source for settings, body profile, assessment records, and independent M60 visual assets.
- Default to email-code sign-in. Its sole login-route switch opens email-password sign-in. Only email-password sign-in exposes an icon-only ellipsis with a localized accessible name.
- The ellipsis opens a bottom sheet containing only phone-password sign-in. Phone-code sign-in is reachable only from phone-password and remains visually muted.
- Fixed headers live outside MobileScroll. Since v0.2.1 the homepage has no fixed VISBODY＋WellnessHub brand bar; it retains an opaque top safe-area cover. Other routes show their localized page title. Keep centered bottom navigation with separate content clearance.
- v0.2.1 preview routes are read-only in-memory fixtures under `#/preview/{none|ai|training|both}`. They may read locale/theme preferences but must never mount personal reports, profile, service-result or session storage, and must preserve the preview scenario through detail navigation.
- Homepage 3D models auto-rotate at roughly 30 seconds per revolution. Pause during interaction, offscreen and while the tab is hidden; resume three seconds after interaction unless the user explicitly paused. Respect reduced-motion as the initial paused state.
- Key section titles use semantic library icons, never oversized/decorative SVGs. Chart styling must target chart classes, not every nested SVG. Both themes must use readable semantic colors throughout all routes.
- Keep the complete default login surface—including social login and guest mode—visible within one phone viewport without requiring vertical scrolling. Do not put the local Demo notice or the exit-guest button back on the login page.
- Use one primary action per authentication screen. Authentication titles are 20px, body/input copy is 14px, labels/help text are 12px, and no legal or Demo copy may be smaller than 11px. Inputs and primary buttons are 48px high with 12px radii.
- v0.2.2: both phone screens place the same blue outlined email-code return after account creation and before the social divider. Email-password places its icon-only ellipsis in that channel region, never beside forgot-password. Email-code has no phone entry. Password screens keep credential switching at logical start and forgot-password at logical end; code screens reserve an empty end column. Hide the keyboard on mode changes and retain the muted phone-code entry.
- Registration defaults to email, keeps phone registration as a secondary segment, and enables submission only after nickname, account, code, password, and consent are valid. A newly registered user must begin the first-profile screen with required identity fields empty.
- M60 modules use the supplied dark navy device-report visual language and independent assets. Never use the full reference screenshots as page backgrounds and do not redesign them into generic white cards.

## Keyboard Rule

The simulated keyboard is a separate top-layer component. Before presenting anything that behaves like iOS navigation or modal UI, dismiss it first.

Call `keyboard.hide()` before:

- pushing, popping, or replacing FlowStack routes
- opening bottom sheets, action sheets, dialogs, menus, or navigation sheets
- starting transitions where the destination should not inherit text-input focus

`FlowStack` already hides the keyboard for `push`, `pop`, and `replace`. `BottomSheet` already hides it before opening. If you add new modal/sheet/navigation primitives, follow the same rule.

When a composer, search surface, or other keyboard-attached component closes, call `keyboard.hide()` in the same event before changing that component's open state. Position attached surfaces from `useKeyboardInsets()` rather than a separate timer or visibility flag so both dismiss together.

When any text-entry control loses focus, dismiss the simulated keyboard. If the control is custom or does not use the runtime's keyboard-aware fields, handle its blur event and call `keyboard.hide()` explicitly. Keep the keyboard open only when focus is moving directly to another text-entry control that should share the same keyboard session.

## Interaction Rules

- Do not trigger buttons or inputs after a pointer has become a drag. Preserve the drag suppression behavior in `MobileScroll`.
- Do not allow native browser image/file dragging inside the phone frame. Preserve the phone-level `dragstart` suppression and non-draggable image styles so scroll drags that begin on images still scroll the prototype.
- Use `KeyboardInput`, `KeyboardTextarea`, or `MobileTextField` for text entry so the simulated keyboard and safe-area insets stay connected.
- Fixed phone chrome should not animate with pushed screens. Screen content can animate; the status bar, camera cutout, and preview chrome should stay put.
- Keep the keyboard below the home indicator/safe area layer in z-index, and above ordinary app UI while visible.
- Keep the home indicator as the topmost safe-area layer in the z-index above everything else in the prototype.
