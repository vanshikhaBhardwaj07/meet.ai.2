import { drizzle } from 'drizzle-orm/neon-http';
import dns from 'dns';

// Global DNS patch to bypass local DNS servers that refuse to resolve *.neon.tech domains
const originalLookup = dns.lookup;
const resolver = new dns.Resolver();
resolver.setServers(['8.8.8.8', '1.1.1.1']);

// @ts-ignore
dns.lookup = function (hostname, options, callback) {
  let cb: any = callback;
  let opts: any = options;
  if (typeof options === 'function') {
    cb = options;
    opts = {};
  }

  if (hostname && hostname.endsWith('.neon.tech')) {
    resolver.resolve4(hostname, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        originalLookup(hostname, opts, cb);
      } else {
        if (opts && typeof opts === 'object' && opts.all) {
          cb(null, addresses.map(addr => ({ address: addr, family: 4 })));
        } else {
          cb(null, addresses[0], 4);
        }
      }
    });
  } else {
    originalLookup(hostname, opts, cb);
  }
};

export const db = drizzle(process.env.DATABASE_URL!);
