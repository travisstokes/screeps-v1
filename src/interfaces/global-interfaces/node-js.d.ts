declare module "node-js-extensions" {
    global {
        // Syntax for adding proprties to `global` (ex "global.log")
        namespace NodeJS {
          interface Global {
            log: any;
          }
        }
      }
  }
