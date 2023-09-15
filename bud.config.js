/**
 * Compiler configuration
 *
 * @see {@link https://roots.io/docs/sage sage documentation}
 * @see {@link https://bud.js.org/guides/configure bud.js configuration guide}
 *
 * @param {import('@roots/bud').Bud} app
 */
export default async (app) => {
  /**
   * Application assets & entrypoints
   *
   * @see {@link https://bud.js.org/docs/bud.entry}
   * @see {@link https://bud.js.org/docs/bud.assets}
   */
  app
    .entry('app', ['@scripts/app', '@styles/app'])
    .entry('editor', ['@scripts/editor', '@styles/editor'])
    .assets(['images'])

    /**
     * Font files (to be referenced in `theme.json`)
     */
    .assets(['@fonts/Roboto-Regular-subset.woff2']);


  /**
   * Set public path
   *
   * @see {@link https://bud.js.org/docs/bud.setPublicPath}
   */
  app.setPublicPath('/app/themes/sage/public/');

  /**
   * Development server settings
   *
   * @see {@link https://bud.js.org/docs/bud.setUrl}
   * @see {@link https://bud.js.org/docs/bud.setProxyUrl}
   * @see {@link https://bud.js.org/docs/bud.watch}
   */
  app
    .setUrl('http://localhost:3000')
    .setProxyUrl('http://example.test')
    .watch(['resources/views', 'app']);

  /**
   * Generate WordPress `theme.json`
   *
   * @note This overwrites `theme.json` on every build.
   *
   * @see {@link https://bud.js.org/extensions/sage/theme.json}
   * @see {@link https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json}
   */
  app.wpjson
    .set('typography.fontFamilies', [
      {
        "fontFamily": "Roboto, sans-serif",
        "slug": "primary",
        "name": "Roboto",
        "fontFace": [
          {
            "fontFamily": "Roboto",
            "fontWeight": "400",
            "src": [
              "@fonts/Roboto-Regular-subset.woff2",
            ],
          },
        ],
      },
    ])

    .enable();


  app
    .after(async () => {
      const manifest = await app.fs.read(`public/manifest.json`);
      const data = app.container(await app.fs.read(`theme.json`));

      data
        .set(`settings.typography.fontFamilies.[0].fontFace.[0].src`, [
          `file:./public/${manifest[`fonts/Roboto-Regular-subset.woff2`]}`,
        ]);

      await app.fs.write(`theme.json`, data.all());
    });
};
