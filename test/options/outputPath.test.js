/* eslint-disable
  prefer-destructuring,
*/
import webpack from '../helpers/compiler';

describe('Options', () => {
  describe('outputPath', () => {
    test('{String}', async () => {
      const config = {
        loader: {
          test: /\.babylon$/,
          options: {
            outputPath: '/test/',
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const { source } = stats.toJson().modules[1];

      expect(source).toMatchSnapshot();
    });

    test('{Function}', async () => {
      const config = {
        loader: {
          test: /\.babylon$/,
          options: {
            outputPath(url) {
              return `test/${url}`;
            },
          },
        },
      };

      const stats = await webpack('fixture.js', config);
      const { source } = stats.toJson().modules[1];

      expect(source).toMatchSnapshot();
    });
  });
});
