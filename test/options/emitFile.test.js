/* eslint-disable
  prefer-destructuring,
*/
import webpack from '../helpers/compiler';

describe('Options', () => {
  describe('emitFile', () => {
    describe('{Boolean}', () => {
      test('True (Default)', async () => {
        const config = {
          loader: {
            test: /\.babylon$/,
            options: {
              emitFile: true,
            },
          },
        };

        const stats = await webpack('fixture.js', config);
        const { assets } = stats.toJson().modules[1];

        expect(assets[0]).toMatchSnapshot();
        expect(assets[1]).toMatchSnapshot();
      });

      test('True (No Manifest)', async () => {
        const config = {
          loader: {
            test: /\.babylon$/,
            options: {
              emitFile: true,
            },
          },
        };

        const stats = await webpack('noManifest/fixture.js', config);
        const { assets } = stats.toJson().modules[1];

        expect(assets[0]).toMatchSnapshot();
      });

      test('False', async () => {
        const config = {
          loader: {
            test: /\.babylon$/,
            options: {
              emitFile: false,
            },
          },
        };

        const stats = await webpack('fixture.js', config);
        const { assets } = stats.toJson().modules[1];

        expect(assets[0]).toBe(undefined);
        expect(assets[1]).toBe(undefined);
      });
    });
  });
});
