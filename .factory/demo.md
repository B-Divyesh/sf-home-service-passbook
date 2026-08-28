# Demo sandbox

Open `/demo` or `https://home-service-passbook.sociobot.in/demo`.

The demo starts with three areas, three assets, three recurring jobs, and four service entries. It includes both recurrence rules, notes, and receipt references. The furnace filter is overdue on the sample date.

The banner stays visible while demo mode is active. **Reset demo** restores the bundled records. **Start for real** opens the separate, empty household passbook.

Demo records use the IndexedDB database `demo:home-service-passbook`. Real records use `home-service-passbook`. The app never reads or writes the real database while the demo banner is visible.

The offline claim can be checked from this route. Load it once, wait for the service worker, switch the browser offline, and reload.

Demo records can be edited and deleted to exercise correction paths. Reset restores the original sample without reading or changing the real database.
