This is a sample repo utilizing NextJS to build a small application, verify the authenticity of the request coming from Kibo and pull user information.


# Getting Started

1. Create a `.env` file from using `.env.example` as a template.
2. Make sure the `appId` used in the subnavlink creation is the `appId` that corresponds with the `KIBO_CLIENT_ID`.
3. The `KIBO_SHARED_SECRET` should match the secret that is paired with the `KIBO_CLIENT_ID` (which should be the linked `appId` as well).  This will be used to verify the `messageHash`
3. `npm run dev` to run locally.  `npm run subnavDev` is there becuase of an issue hosting through ngrok that was requiring a full build to work when requesting through Kibo Admin.


