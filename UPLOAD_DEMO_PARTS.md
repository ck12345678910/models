# TerraForge 4.0 temporary guest demo

This isolated public branch contains only deployment setup and, once uploaded, **encrypted** runtime files. The decryption key is in Render environment settings, not in GitHub. It does not contain real login credentials or live player data.

Upload `TerraForge_Demo_Encrypted_Part_1.bin` and `TerraForge_Demo_Encrypted_Part_2.bin` to the **root of this branch**. Render automatically redeploys the service on branch changes. After both files are available, `bootstrap.mjs` verifies and decrypts them at build time, installs TerraForge, and enables its disposable guest world. Until both files are present the URL displays an awaiting-package status page.

Free hosting can sleep or reset data. Never use this temporary service for production accounts.
