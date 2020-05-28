import { globalModule } from './module';
import { Module } from './module/Module';
import { Record } from './module/Record';
import { IBundleOption } from './type';

/**
 * handle script loaded
 * @param id 
 * @param script 
 * @param timeout 
 */
function onScriptComplete (id: string, script: HTMLScriptElement, timeout: number) {
  script.onerror = script.onload = null;
  clearTimeout(timeout);

  const record = Module.record.get(id);
  if (!id.endsWith('_scripts_') && record && !record.loaded) {
    Module.record.delete(id);
  }
}

/**
 * handle script load error
 * @param id 
 * @param script 
 * @param timeout 
 */
function onScriptError (id: string, script: HTMLScriptElement, timeout: number) {
  const record = Module.record.get(id);
  onScriptComplete(id, script, timeout);
  if (record) {
    record.reject(new Error('script load fail'))
  }
}


/**
 * append script
 * @param {IBundleOption} bundle 
 */
function jsonpRequire(id: string, url: string) {
  const script = document.createElement('script');
  script.charset = 'utf-8';
  script.src = url;

  script.setAttribute('nonce', '');

  const timeout = window.setTimeout(() => {
    onScriptError(id, script, timeout);
  }, 120000);

  script.onerror = () => {
    onScriptError(id, script, timeout);
  }

  script.onload = () => {
    onScriptComplete(id, script, timeout);
  };

  document.head.appendChild(script);
}

// export async function fetchRequire(id: string, url: string, enableWrapper: boolean) {
//   const resp = await fetch(url);
//   const code = await resp.text();
//   if (enableWrapper) {
//     const resolver = new Function(`
//       return function(require, module, exports, {window, location, history, document}){ 
//         with(window.__CONSOLE_OS_GLOBAL_VARS_) { 
//           ${code}
//         }
//       })//@sourceURL=${url}
//     `)
//   }
// }

/**
 * async require the bundle from url
 * @param bundle {IBundleOption}
 */
export async function requireEnsure<T>(bundle: IBundleOption) {
  // if module has been resolved
  if (!bundle.noCache && globalModule.resolved(bundle.id)) {
    // if loader contains the context(window, location)
    // then get the new export using new context
    if (bundle.context) {
      return globalModule.requireIsolateWithContext(bundle.id, bundle.context);
    }
    // return the cached module
    return globalModule.require(bundle.id);
  }

  const promises: Promise<T>[] = [];

  let chunkRecord: Record<T> = Module.record.get(bundle.id);

  if (!chunkRecord || !chunkRecord.loaded) {
    if (chunkRecord) {
      promises.push(chunkRecord.promise);
    } else {
      const promise = new Promise<T>(function(resolve, reject) {
        chunkRecord = new Record();
        chunkRecord.resolve = resolve;
        chunkRecord.reject = reject;
        chunkRecord.context = bundle.context;
        chunkRecord.deps = bundle.deps;
        Module.record.set(bundle.id, chunkRecord)
      });
      chunkRecord.promise = promise
      promises.push(promise);
      jsonpRequire(bundle.id, bundle.url);
    }
  }

  await Promise.all(promises);

  return globalModule.require(bundle.id);
}
