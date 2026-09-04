import { drizzle } from 'drizzle-orm/neon-http';
import dns from 'dns';

// Global DNS patch to bypass local DNS servers that refuse to resolve *.neon.tech domains
type LookupCallback = (
  err: NodeJS.ErrnoException | null,
  address: string | dns.LookupAddress[],
  family?: number
) => void;

// dns.lookup is heavily overloaded; this patch handles every overload with one
// uniform signature, so both the original and the replacement are viewed
// through a single flattened signature instead.
const originalLookup = dns.lookup as unknown as (
  hostname: string,
  options: dns.LookupOptions,
  callback: LookupCallback
) => void;

const resolver = new dns.Resolver();
resolver.setServers(['8.8.8.8', '1.1.1.1']);

// @ts-expect-error - the uniform signature below deliberately does not match
// the overloaded declaration of dns.lookup.
dns.lookup = function (
  hostname: string,
  options: dns.LookupOptions | LookupCallback,
  callback?: LookupCallback
) {
  let cb = callback as LookupCallback;
  let opts = options as dns.LookupOptions;
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
